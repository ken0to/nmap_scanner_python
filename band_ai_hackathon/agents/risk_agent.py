"""Rule-based veto logic with no model or external API dependency."""

from __future__ import annotations

from typing import Any, Dict, List

from core.band_bus import BandBus
from core.message_schema import AgentMessage


class RiskAgent:
    name = "Risk Agent"
    provider = "deterministic-rule-engine"

    def __init__(self, bus: BandBus) -> None:
        self.bus = bus

    def evaluate(
        self,
        facts: Dict[str, Any],
        challenge: Dict[str, Any],
    ) -> AgentMessage:
        triggered_rules: List[Dict[str, Any]] = []
        unsupported_total = challenge["unsupported_total"]
        real_ebitda = challenge["recalculated_ebitda"]
        real_multiple = facts["asking_price"] / real_ebitda

        if unsupported_total >= 500_000:
            triggered_rules.append(
                {
                    "rule": "UNSUPPORTED_ADDBACKS_GE_500K",
                    "observed": unsupported_total,
                    "threshold": 500_000,
                }
            )
        if real_ebitda < 1_500_000:
            triggered_rules.append(
                {
                    "rule": "REAL_EBITDA_BELOW_1_5M",
                    "observed": real_ebitda,
                    "threshold": 1_500_000,
                }
            )
        if real_multiple > 6.0:
            triggered_rules.append(
                {
                    "rule": "ASKING_MULTIPLE_ABOVE_6X_REAL_EBITDA",
                    "observed": round(real_multiple, 2),
                    "threshold": 6.0,
                }
            )

        outcome = "VETO" if triggered_rules else "CLEAR"
        payload = {
            "outcome": outcome,
            "triggered_rules": triggered_rules,
            "rule_count": len(triggered_rules),
            "required_action": (
                "Finance must re-underwrite using supported EBITDA and a lower price."
                if triggered_rules
                else "No revision required."
            ),
        }
        return self.bus.publish(
            agent=self.name,
            message_type="VETO",
            provider=self.provider,
            payload=payload,
        )
