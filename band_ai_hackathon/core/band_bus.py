"""Local event bus that simulates a Band committee room."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Callable, Dict, List, Protocol

from .message_schema import AgentMessage


class BandBus(Protocol):
    """Provider-neutral contract for a Phase 2 Band adapter."""

    def publish(
        self,
        *,
        agent: str,
        message_type: str,
        provider: str,
        payload: Dict[str, Any],
    ) -> AgentMessage:
        ...

    def history(self) -> List[Dict[str, Any]]:
        ...


class MockBandBus:
    """In-memory room with deterministic IDs and timestamps."""

    def __init__(
        self,
        room_id: str = "dealroom-phase-1",
        start_time: datetime | None = None,
    ) -> None:
        self.room_id = room_id
        self._start_time = start_time or datetime(
            2026, 1, 1, 9, 0, 0, tzinfo=timezone.utc
        )
        self._messages: List[AgentMessage] = []
        self._subscribers: List[Callable[[AgentMessage], None]] = []

    def subscribe(self, callback: Callable[[AgentMessage], None]) -> None:
        self._subscribers.append(callback)

    def publish(
        self,
        *,
        agent: str,
        message_type: str,
        provider: str,
        payload: Dict[str, Any],
    ) -> AgentMessage:
        sequence = len(self._messages) + 1
        message = AgentMessage(
            event_id=f"{self.room_id}-{sequence:04d}",
            agent=agent,
            type=message_type,
            provider=provider,
            payload=payload,
            timestamp=(self._start_time + timedelta(seconds=sequence - 1)).isoformat(),
        )
        message.validate()
        self._messages.append(message)
        for subscriber in self._subscribers:
            subscriber(message)
        return message

    def history(self) -> List[Dict[str, Any]]:
        return [message.to_dict() for message in self._messages]

    def messages_of_type(self, message_type: str) -> List[Dict[str, Any]]:
        return [
            message.to_dict()
            for message in self._messages
            if message.type == message_type
        ]
