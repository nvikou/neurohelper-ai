<<<<<<< HEAD
from pydantic import BaseModel, Field
from typing import List, Literal

Role = Literal["system", "user", "assistant"]

class Message(BaseModel):
    role: Role
    content: str

class ChatRef(BaseModel):
    id: str
    title: str

class ChatCreate(BaseModel):
    title: str = Field(min_length=1)

class ChatPatch(BaseModel):
    title: str = Field(min_length=1)

class ChatRequest(BaseModel):
    chat_id: str
    user_message: str
    model: str = "gpt-4o-mini"
    system_prompt: str = ""
=======
from datetime import datetime
from typing import Literal

from pydantic import BaseModel
from pydantic import Field


TaskType = Literal["plan", "checklist", "template", "ideas", "general"]


class HistoryItem(BaseModel):
    id: str
    query: str
    task_type: TaskType
    response: str
    created_at: datetime


class GenerateRequest(BaseModel):
    query: str = Field(..., min_length=1)
    task_type: TaskType = "general"

>>>>>>> 2e92c2f (NeuroHelper)

class Error(BaseModel):
    error: str
