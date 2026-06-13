"""Final investment committee decision and memo generation."""

from __future__ import annotations

from typing import Any, Dict

from core.band_bus import BandBus
from core.message_schema import AgentMessage


class CommitteeAgent:
    name = "Committee Agent"
    provider = "mock-local-committee-provider"

    def __init__(self, bus: BandBus) -> None:
        self.bus = bus

    def decide(
        self,
        facts: Dict[str, Any],
        initial: Dict[str, Any],
        challenge: Dict[str, Any],
        veto: Dict[str, Any],
        revised: Dict[str, Any],
    ) -> AgentMessage:
        final_decision = (
            "CONDITIONAL BUY"
            if veto["outcome"] == "VETO"
            and revised["revised_recommendation"] == "CONDITIONAL BUY"
            else "DECLINE"
        )
        memo_markdown = f"""# Investment Committee Memo

## Target
**{facts["company"]}** | {facts["sector"]}

## Decision
**{final_decision}**

## Decision Change
The initial **{initial["recommendation"]}** recommendation relied on $2.1M of
Adjusted EBITDA. The Skeptic Agent removed $0.7M of unsupported owner-related
add-backs, producing validated EBITDA of $1.4M. The Risk Agent then issued a
rules-based veto.

## Revised Underwriting
- Validated EBITDA: **$1.4M**
- Maximum entry multiple: **4.0x**
- Maximum purchase price: **$5.6M**
- Seller asking price: **$9.5M**

## Conditions Precedent
1. Purchase price must not exceed $5.6M.
2. Independent quality-of-earnings review must validate $1.4M EBITDA.
3. Unsupported owner and family payroll add-backs receive no credit.
4. Debt at close must not exceed 2.5x validated EBITDA.

## Committee Rationale
The business remains investable only at a price supported by defensible cash
flow. The original BUY is superseded by a CONDITIONAL BUY subject to every
condition above.
"""
        payload = {
            "initial_decision": initial["recommendation"],
            "final_decision": final_decision,
            "decision_changed": initial["recommendation"] != final_decision,
            "validated_ebitda": challenge["recalculated_ebitda"],
            "maximum_purchase_price": revised["maximum_purchase_price"],
            "conditions": revised["conditions"],
            "veto_resolved": final_decision == "CONDITIONAL BUY",
            "memo_markdown": memo_markdown,
        }
        return self.bus.publish(
            agent=self.name,
            message_type="FINAL_DECISION",
            provider=self.provider,
            payload=payload,
        )
