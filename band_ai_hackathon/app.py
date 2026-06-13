"""Streamlit interface for the deterministic DealRoom AI committee."""

from __future__ import annotations

import json

import streamlit as st

from core.veto_loop import run_dealroom_workflow


st.set_page_config(
    page_title="DealRoom AI",
    page_icon="DR",
    layout="wide",
)


@st.cache_data
def load_demo() -> dict:
    return run_dealroom_workflow().to_dict()


def money(value: float) -> str:
    return f"${value / 1_000_000:.1f}M"


result = load_demo()
history = result["history"]

st.title("DealRoom AI")
st.caption(
    "Deterministic local multi-agent investment committee | Phase 1 mock providers"
)

st.header("1. Agent Timeline")
timeline_rows = [
    {
        "Step": index,
        "Event": message["type"],
        "Agent": message["agent"],
        "Provider": message["provider"],
        "Timestamp": message["timestamp"],
    }
    for index, message in enumerate(history, start=1)
]
st.dataframe(timeline_rows, width="stretch", hide_index=True)

for message in history:
    with st.expander(f'{message["type"]} | {message["agent"]}'):
        st.json(message)

st.header("2. Decision Change")
initial_column, arrow_column, final_column = st.columns([4, 1, 4])
with initial_column:
    st.metric("Initial Finance Recommendation", result["initial_decision"])
    st.caption("Based on claimed Adjusted EBITDA of $2.1M")
with arrow_column:
    st.markdown("## ->")
with final_column:
    st.metric("Final Committee Decision", result["final_decision"])
    st.caption("Based on validated EBITDA of $1.4M and binding conditions")

challenge = next(item for item in history if item["type"] == "CHALLENGE")
revised = next(item for item in history if item["type"] == "REVISED_PROPOSAL")
metric_one, metric_two, metric_three = st.columns(3)
metric_one.metric("Claimed EBITDA", "$2.1M")
metric_two.metric("Validated EBITDA", money(challenge["payload"]["recalculated_ebitda"]))
metric_three.metric(
    "Maximum Purchase Price",
    money(revised["payload"]["maximum_purchase_price"]),
)

st.header("3. Audit Trail")
audit_event = history[-1]
st.code(result["audit_hash"], language=None)
st.write(
    f'Algorithm: **{audit_event["payload"]["algorithm"]}** | '
    f'Events hashed: **{audit_event["payload"]["hashed_event_count"]}** | '
    f'Last sealed event: **{audit_event["payload"]["hashed_through_event_id"]}**'
)
st.download_button(
    "Download full event history",
    data=json.dumps(history, indent=2),
    file_name="dealroom_ai_audit_history.json",
    mime="application/json",
)

st.header("4. Final IC Memo")
st.markdown(result["memo_markdown"].replace("$", r"\$"))
st.download_button(
    "Download IC memo",
    data=result["memo_markdown"],
    file_name="dealroom_ai_ic_memo.md",
    mime="text/markdown",
)
