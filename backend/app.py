import json
import os
from datetime import datetime
from typing import Dict
from typing import List
from typing import cast
from uuid import uuid4

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi import Query
from fastapi import Request
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.responses import PlainTextResponse
from fastapi.responses import Response
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from .models import Error
from .models import GenerateRequest
from .models import HistoryItem
from .models import TaskType
from .neuro_helper import SYSTEM_PROMPT
from .neuro_helper import get_openai_client


app = FastAPI(title="NeuroHelper")

session_secret = os.environ.get("SESSION_SECRET")
if not session_secret:
    raise RuntimeError("SESSION_SECRET is not set")

app.add_middleware(
    SessionMiddleware,
    secret_key=session_secret,
    same_site="lax",
    https_only=False,
)


STORE: Dict[str, Dict[str, List[HistoryItem]]] = {}


TASK_HINTS = {
    "plan": "Format: PLAN. Make a plan with time and priorities.",
    "checklist": "Format: CHECKLIST. Respond strictly as a checklist.",
    "template": "Format: TEMPLATE. Give a ready-to-copy template.",
    "ideas": "Format: IDEAS. Give a numbered list of ideas.",
    "general": "Format: GENERAL. Give a brief structured answer.",
}


def _get_sid(request: Request) -> str:
    sid = request.session.get("sid")
    if not sid:
        sid = str(uuid4())
        request.session["sid"] = sid
    if sid not in STORE:
        STORE[sid] = {"history": []}
    return sid


def _build_user_prompt(query: str, task_type: TaskType) -> str:
    return f"{TASK_HINTS[task_type]}\n\nЗапрос пользователя:\n{query}"


def _save_history_item(
    sid: str,
    query: str,
    task_type: TaskType,
    response_text: str,
) -> HistoryItem:
    item = HistoryItem(
        id=str(uuid4()),
        query=query,
        task_type=task_type,
        response=response_text,
        created_at=datetime.utcnow(),
    )
    STORE[sid]["history"].append(item)
    return item


@app.get("/healthz")
def healthz() -> PlainTextResponse:
    return PlainTextResponse("OK")


@app.get("/api/v1/history", response_model=List[HistoryItem])
def get_history(request: Request) -> List[HistoryItem]:
    sid = _get_sid(request)
    return sorted(
        STORE[sid].get("history", []),
        key=lambda item: item.created_at,
        reverse=True,
    )


@app.post(
    "/api/v1/generate",
    response_model=HistoryItem,
    responses={500: {"model": Error}},
)
def generate(payload: GenerateRequest, request: Request) -> HistoryItem:
    sid = _get_sid(request)
    try:
        client = get_openai_client()
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": _build_user_prompt(
                        payload.query, payload.task_type
                    ),
                },
            ],
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    text = completion.choices[0].message.content or ""
    return _save_history_item(sid, payload.query, payload.task_type, text)


@app.get("/api/v1/generate/stream")
def generate_stream(
    request: Request,
    query: str = Query(..., min_length=1),
    task_type: TaskType = Query("general"),
) -> StreamingResponse:
    sid = _get_sid(request)

    def event_stream():
        chunks: List[str] = []
        try:
            client = get_openai_client()
            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                stream=True,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": _build_user_prompt(query, task_type),
                    },
                ],
            )
            for part in stream:
                delta = part.choices[0].delta.content or ""
                if not delta:
                    continue
                chunks.append(delta)
                payload = json.dumps({"delta": delta}, ensure_ascii=False)
                yield f"data: {payload}\n\n"
            full_response = "".join(chunks)
            item = _save_history_item(sid, query, task_type, full_response)
            done_payload = json.dumps(
                {"done": True, "item": item.model_dump(mode="json")},
                ensure_ascii=False,
            )
            yield f"data: {done_payload}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as exc:
            error_payload = json.dumps(
                {"error": str(exc)}, ensure_ascii=False
            )
            yield f"data: {error_payload}\n\n"
            yield "data: [DONE]\n\n"

    headers = {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
    }
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers=headers,
    )


@app.delete("/api/v1/history/{item_id}")
def delete_history_item(item_id: str, request: Request) -> Dict[str, bool]:
    sid = _get_sid(request)
    history = STORE[sid]["history"]
    STORE[sid]["history"] = [item for item in history if item.id != item_id]
    return {"ok": True}


@app.post("/api/v1/reset-history")
def reset_history(request: Request) -> Dict[str, bool]:
    sid = _get_sid(request)
    STORE[sid]["history"] = []
    return {"ok": True}


frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend_dist")
frontend_dist = os.path.abspath(frontend_dist)
if os.path.isdir(frontend_dist):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(frontend_dist, "assets")),
    )


@app.get("/{full_path:path}", response_model=None)
def serve_spa(full_path: str) -> Response:
    if full_path.startswith("api/") or full_path == "healthz":
        return JSONResponse({"error": "Not found"}, status_code=404)

    index_file = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_file):
        return cast(FileResponse, FileResponse(index_file))
    return JSONResponse(
        {"error": "Frontend is not built"}, status_code=503
    )
