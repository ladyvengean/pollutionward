# api/chat.py

from fastapi import APIRouter
from services.ward_context import build_ward_context
from services.rules import infer_causes, recommend_actions
from services.prompt import build_prompt
from services.llm import call_llm

router = APIRouter()

@router.post("/chat")
def chat(payload: dict):
    ward_id = payload["wardId"]
    message = payload["message"]

    context = build_ward_context(ward_id)
    causes = infer_causes(context)
    actions = recommend_actions(context)

    prompt = build_prompt(context, causes, actions, message)
    reply = call_llm(prompt)

    return { "reply": reply }

def call_llm(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    return response.choices[0].message.content
