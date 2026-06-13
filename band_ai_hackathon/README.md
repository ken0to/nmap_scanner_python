# DealRoom AI - Phase 1

DealRoom AI is a deterministic local MVP of a multi-agent investment committee.
It demonstrates agents challenging assumptions, issuing a veto, forcing a
recalculation, changing the committee decision, and sealing the full event
history with SHA-256.

This phase does not call external APIs. Every provider is local and mock-backed.

## Demo Outcome

The workflow always produces this sequence:

```text
FACTS -> PROPOSAL -> CHALLENGE -> VETO -> REVISED_PROPOSAL
      -> FINAL_DECISION -> AUDIT_HASH
```

1. The Document Intake Agent extracts facts from three local JSON fixtures.
2. The Finance Agent calculates $2.1M Adjusted EBITDA and recommends `BUY`.
3. The Skeptic Agent rejects $0.7M of unsupported owner add-backs and
   recalculates EBITDA to $1.4M.
4. The deterministic Risk Agent triggers three rules and publishes `VETO`.
5. The Finance Agent caps value at 4.0x validated EBITDA, or $5.6M.
6. The Committee Agent changes the decision to `CONDITIONAL BUY`.
7. The Audit Agent publishes a SHA-256 digest of the preceding event history.

## Run Locally

Requires Python 3.9 or later.

```bash
cd dealroom-ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python tests/self_test.py
streamlit run app.py
```

The terminal self-test uses only the Python standard library. Streamlit is
needed for the browser UI.

## Architecture

- `core/message_schema.py` defines the immutable structured event.
- `core/band_bus.py` defines a provider-neutral bus contract and the local
  `MockBandBus`.
- `core/veto_loop.py` orchestrates the complete committee sequence.
- `core/audit_hash.py` canonicalizes history and calculates SHA-256.
- `agents/` contains one deterministic implementation per committee role.
- `examples/` contains the mock source documents.
- `tests/self_test.py` validates calculations, decisions, order, and audit hash.

Every event contains:

```json
{
  "event_id": "dealroom-phase-1-0001",
  "agent": "Document Intake Agent",
  "type": "FACTS",
  "provider": "mock-local-document-provider",
  "payload": {},
  "timestamp": "2026-01-01T09:00:00+00:00"
}
```

Event IDs and timestamps are deterministic in Phase 1, so identical fixtures
produce an identical audit digest.

## Phase 2 Provider Extension

Agents depend on the `BandBus` protocol rather than a network SDK. A Phase 2
adapter can implement the same `publish()` and `history()` methods for a real
Band room. The `provider` field also makes model routing explicit, allowing
AI/ML API and Featherless implementations to replace individual mock agents
without changing the workflow or message schema.

Environment variable placeholders are documented in `.env.example`. They are
intentionally unused in Phase 1.
