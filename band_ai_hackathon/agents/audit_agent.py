"""Final audit event containing the canonical history digest."""

from __future__ import annotations

from core.audit_hash import sha256_history
from core.band_bus import BandBus
from core.message_schema import AgentMessage


class AuditAgent:
    name = "Audit Agent"
    provider = "local-sha256"

    def __init__(self, bus: BandBus) -> None:
        self.bus = bus

    def seal(self) -> AgentMessage:
        history_to_hash = self.bus.history()
        digest = sha256_history(history_to_hash)
        payload = {
            "algorithm": "SHA-256",
            "sha256": digest,
            "hashed_event_count": len(history_to_hash),
            "hashed_through_event_id": history_to_hash[-1]["event_id"],
            "canonicalization": "JSON sort_keys=true, compact separators, ASCII",
            "verification": (
                "Recompute SHA-256 over the canonical JSON history excluding "
                "this AUDIT_HASH event."
            ),
        }
        return self.bus.publish(
            agent=self.name,
            message_type="AUDIT_HASH",
            provider=self.provider,
            payload=payload,
        )
