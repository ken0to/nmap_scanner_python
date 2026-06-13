"""Deterministic challenge to unsupported underwriting assumptions."""

from __future__ import annotations

from typing import Any, Dict

from core.band_bus import BandBus
from core.message_schema import AgentMessage


class SkepticAgent:
    name = "Skeptic Agent"
    provider = "mock-local-skeptic-provider"

    def __init__(self, bus: BandBus) -> None:
        self.bus = bus

    def challenge(
        self,
        facts: Dict[str, Any],
        proposal: Dict[str, Any],
    ) -> AgentMessage:
        unsupported = [
            item for item in facts["claimed_addbacks"] if not item["supported"]
        ]
        supported = [
            item for item in facts["claimed_addbacks"] if item["supported"]
        ]
        unsupported_total = sum(item["amount"] for item in unsupported)
        supported_total = sum(item["amount"] for item in supported)
        recalculated_ebitda = facts["reported_ebitda"] + supported_total

        payload = {
            "challenge": "Unsupported owner-related add-backs overstate EBITDA.",
            "challenged_recommendation": proposal["recommendation"],
            "unsupported_addbacks": unsupported,
            "unsupported_total": unsupported_total,
            "supported_addbacks": supported,
            "supported_total": supported_total,
            "recalculated_ebitda": recalculated_ebitda,
            "asking_price_multiple_on_real_ebitda": round(
                facts["asking_price"] / recalculated_ebitda, 2
            ),
            "conclusion": (
                "Remove $0.7M of unsupported owner compensation and family "
                "payroll add-backs. Real EBITDA is $1.4M, not $2.1M."
            ),
        }
        return self.bus.publish(
            agent=self.name,
            message_type="CHALLENGE",
            provider=self.provider,
            payload=payload,
        )
