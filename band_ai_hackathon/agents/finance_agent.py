"""Initial and revised deterministic underwriting calculations."""

from __future__ import annotations

from typing import Any, Dict

from core.band_bus import BandBus
from core.message_schema import AgentMessage


class FinanceAgent:
    name = "Finance Agent"
    provider = "mock-local-finance-provider"

    def __init__(self, bus: BandBus) -> None:
        self.bus = bus

    def propose(self, facts: Dict[str, Any]) -> AgentMessage:
        adjusted_ebitda = facts["reported_ebitda"] + facts["total_claimed_addbacks"]
        entry_multiple = facts["asking_price"] / adjusted_ebitda
        payload = {
            "reported_ebitda": facts["reported_ebitda"],
            "claimed_addbacks": facts["total_claimed_addbacks"],
            "adjusted_ebitda": adjusted_ebitda,
            "asking_price": facts["asking_price"],
            "entry_multiple": round(entry_multiple, 2),
            "recommendation": "BUY",
            "rationale": (
                "The asking price is 4.52x claimed Adjusted EBITDA and bank "
                "deposits reconcile to reported revenue."
            ),
            "calculation": "$1.2M reported EBITDA + $0.9M add-backs = $2.1M",
        }
        return self.bus.publish(
            agent=self.name,
            message_type="PROPOSAL",
            provider=self.provider,
            payload=payload,
        )

    def revise(
        self,
        facts: Dict[str, Any],
        challenge: Dict[str, Any],
        veto: Dict[str, Any],
    ) -> AgentMessage:
        real_ebitda = challenge["recalculated_ebitda"]
        maximum_multiple = 4.0
        maximum_price = real_ebitda * maximum_multiple
        payload = {
            "previous_recommendation": "BUY",
            "revised_recommendation": "CONDITIONAL BUY",
            "accepted_challenge": challenge["challenge"],
            "acknowledged_veto_rules": veto["triggered_rules"],
            "revised_ebitda": real_ebitda,
            "maximum_entry_multiple": maximum_multiple,
            "maximum_purchase_price": maximum_price,
            "price_reduction_required": facts["asking_price"] - maximum_price,
            "conditions": [
                "Purchase price must not exceed $5.6M.",
                "Independent quality-of-earnings review must validate $1.4M EBITDA.",
                "No credit for owner or family payroll add-backs without evidence.",
                "Debt at close must not exceed 2.5x validated EBITDA.",
            ],
            "calculation": "$1.2M reported EBITDA + $0.2M supported add-back = $1.4M",
        }
        return self.bus.publish(
            agent=self.name,
            message_type="REVISED_PROPOSAL",
            provider=self.provider,
            payload=payload,
        )
