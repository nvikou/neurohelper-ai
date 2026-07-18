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


class Error(BaseModel):
    error: str
