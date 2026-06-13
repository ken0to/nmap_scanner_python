"""End-to-end deterministic committee orchestration."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List

from agents import (
    AuditAgent,
    CommitteeAgent,
    DocumentIntakeAgent,
    FinanceAgent,
    RiskAgent,
    SkepticAgent,
)
from core.audit_hash import sha256_history
from core.band_bus import MockBandBus


EXPECTED_TIMELINE = [
    "FACTS",
    "PROPOSAL",
    "CHALLENGE",
    "VETO",
    "REVISED_PROPOSAL",
    "FINAL_DECISION",
    "AUDIT_HASH",
]


@dataclass(frozen=True)
class WorkflowResult:
    history: List[Dict[str, Any]]
    initial_decision: str
    final_decision: str
    audit_hash: str
    memo_markdown: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "history": self.history,
            "initial_decision": self.initial_decision,
            "final_decision": self.final_decision,
            "audit_hash": self.audit_hash,
            "memo_markdown": self.memo_markdown,
        }


def run_dealroom_workflow(examples_dir: Path | None = None) -> WorkflowResult:
    bus = MockBandBus()
    document_agent = DocumentIntakeAgent(bus, examples_dir=examples_dir)
    finance_agent = FinanceAgent(bus)
    skeptic_agent = SkepticAgent(bus)
    risk_agent = RiskAgent(bus)
    committee_agent = CommitteeAgent(bus)
    audit_agent = AuditAgent(bus)

    facts_message = document_agent.run()
    proposal_message = finance_agent.propose(facts_message.payload)
    challenge_message = skeptic_agent.challenge(
        facts_message.payload,
        proposal_message.payload,
    )
    veto_message = risk_agent.evaluate(
        facts_message.payload,
        challenge_message.payload,
    )
    if veto_message.payload["outcome"] != "VETO":
        raise RuntimeError("Demo invariant failed: Risk Agent did not issue a veto")

    revised_message = finance_agent.revise(
        facts_message.payload,
        challenge_message.payload,
        veto_message.payload,
    )
    final_message = committee_agent.decide(
        facts_message.payload,
        proposal_message.payload,
        challenge_message.payload,
        veto_message.payload,
        revised_message.payload,
    )
    audit_message = audit_agent.seal()

    history = bus.history()
    timeline = [message["type"] for message in history]
    if timeline != EXPECTED_TIMELINE:
        raise RuntimeError(f"Unexpected timeline: {timeline}")
    if sha256_history(history[:-1]) != audit_message.payload["sha256"]:
        raise RuntimeError("Audit hash verification failed")

    return WorkflowResult(
        history=history,
        initial_decision=proposal_message.payload["recommendation"],
        final_decision=final_message.payload["final_decision"],
        audit_hash=audit_message.payload["sha256"],
        memo_markdown=final_message.payload["memo_markdown"],
    )
