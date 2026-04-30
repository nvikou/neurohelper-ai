import os
from functools import lru_cache

from openai import OpenAI


SYSTEM_PROMPT = """You are NeuroHelper — an assistant for everyday tasks and ideas for study/work.

Answer formats:
PLAN: 📅 Plan with time/priorities
CHECKLIST: ✅ Checklist with checkboxes
TEMPLATE: 📝 Ready-to-copy template
IDEAS: 💡 Numbered list of ideas
GENERAL: Clear structured answer

Respond **briefly**, **structurally**, and **usefully** in Markdown."""


@lru_cache(maxsize=1)
def get_openai_client() -> OpenAI:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return OpenAI(api_key=api_key, timeout=30.0)
