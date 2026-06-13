"""Mock document intake and fact extraction."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict

from core.band_bus import BandBus
from core.message_schema import AgentMessage


class DocumentIntakeAgent:
    name = "Document Intake Agent"
    provider = "mock-local-document-provider"

    def __init__(self, bus: BandBus, examples_dir: Path | None = None) -> None:
        self.bus = bus
        self.examples_dir = examples_dir or Path(__file__).resolve().parents[1] / "examples"

    def _load_json(self, filename: str) -> Dict[str, Any]:
        with (self.examples_dir / filename).open(encoding="utf-8") as handle:
            return json.load(handle)

    def run(self) -> AgentMessage:
        profit_and_loss = self._load_json("mock_pl_statement.json")
        bank_summary = self._load_json("mock_bank_summary.json")
        management_notes = self._load_json("mock_management_notes.json")

        claimed_addbacks = management_notes["claimed_addbacks"]
        facts = {
            "company": profit_and_loss["company"],
            "sector": management_notes["sector"],
            "period": profit_and_loss["period"],
            "revenue": profit_and_loss["revenue"],
            "reported_ebitda": profit_and_loss["reported_ebitda"],
            "asking_price": management_notes["asking_price"],
            "claimed_addbacks": claimed_addbacks,
            "total_claimed_addbacks": sum(
                item["amount"] for item in claimed_addbacks
            ),
            "cash_balance": bank_summary["ending_cash_balance"],
            "existing_debt": bank_summary["existing_debt"],
            "bank_revenue_matches_pl": (
                bank_summary["deposits_reconciled_to_revenue"]
                == profit_and_loss["revenue"]
            ),
            "customer_concentration_pct": management_notes[
                "largest_customer_revenue_pct"
            ],
            "source_documents": [
                "mock_pl_statement.json",
                "mock_bank_summary.json",
                "mock_management_notes.json",
            ],
        }
        return self.bus.publish(
            agent=self.name,
            message_type="FACTS",
            provider=self.provider,
            payload=facts,
        )
