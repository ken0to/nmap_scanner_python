"""Canonical SHA-256 helpers for an auditable event history."""

from __future__ import annotations

import hashlib
import json
from typing import Any, Dict, List


def canonical_history_json(history: List[Dict[str, Any]]) -> str:
    return json.dumps(
        history,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=True,
    )


def sha256_history(history: List[Dict[str, Any]]) -> str:
    canonical = canonical_history_json(history).encode("utf-8")
    return hashlib.sha256(canonical).hexdigest()
