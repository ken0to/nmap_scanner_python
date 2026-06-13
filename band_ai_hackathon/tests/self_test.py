"""Run the complete Phase 1 workflow and print its audit timeline."""

from __future__ import annotations

import json
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from core.audit_hash import sha256_history
from core.message_schema import REQUIRED_MESSAGE_FIELDS
from core.veto_loop import EXPECTED_TIMELINE, run_dealroom_workflow


def main() -> None:
    result = run_dealroom_workflow()
    actual_timeline = [message["type"] for message in result.history]

    assert actual_timeline == EXPECTED_TIMELINE
    assert result.initial_decision == "BUY"
    assert result.final_decision == "CONDITIONAL BUY"
    assert result.history[1]["payload"]["adjusted_ebitda"] == 2_100_000
    assert result.history[2]["payload"]["recalculated_ebitda"] == 1_400_000
    assert result.history[3]["payload"]["outcome"] == "VETO"
    assert result.audit_hash == sha256_history(result.history[:-1])
    assert all(
        REQUIRED_MESSAGE_FIELDS.issubset(message) for message in result.history
    )
    json.dumps(result.history)

    print("DealRoom AI Phase 1 - deterministic self-test")
    print("=" * 72)
    for index, message in enumerate(result.history, start=1):
        summary = {
            "event_id": message["event_id"],
            "agent": message["agent"],
            "type": message["type"],
            "provider": message["provider"],
            "timestamp": message["timestamp"],
        }
        print(f"{index}. {json.dumps(summary, sort_keys=True)}")

    print("-" * 72)
    print(f"Decision change: {result.initial_decision} -> {result.final_decision}")
    print(f"SHA-256: {result.audit_hash}")
    print("SELF-TEST PASSED")


if __name__ == "__main__":
    main()
