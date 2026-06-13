"""Structured event schema shared by every DealRoom AI agent."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Dict


REQUIRED_MESSAGE_FIELDS = {
    "event_id",
    "agent",
    "type",
    "provider",
    "payload",
    "timestamp",
}


@dataclass(frozen=True)
class AgentMessage:
    """Immutable, JSON-serializable message published to the committee room."""

    event_id: str
    agent: str
    type: str
    provider: str
    payload: Dict[str, Any]
    timestamp: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def validate(self) -> None:
        message = self.to_dict()
        missing = REQUIRED_MESSAGE_FIELDS.difference(message)
        if missing:
            raise ValueError(f"Message is missing fields: {sorted(missing)}")
        if not all(
            isinstance(message[field], str) and message[field]
            for field in ("event_id", "agent", "type", "provider", "timestamp")
        ):
            raise ValueError("Message metadata fields must be non-empty strings")
        if not isinstance(self.payload, dict):
            raise ValueError("Message payload must be a dictionary")
