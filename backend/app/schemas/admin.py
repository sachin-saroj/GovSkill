import uuid
from pydantic import BaseModel, ConfigDict, Field


class AdminAttemptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_email: str
    module_title: str
    score: int
    total: int
    submitted_at: str


class ModuleCreate(BaseModel):
    title: str = Field(min_length=3)
    content: str = Field(min_length=10)


class ModuleUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3)
    content: str | None = Field(default=None, min_length=10)


class AdminQuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    module_id: uuid.UUID
    question: str
    options: list[str]
    correct_option_index: int
    competency: str | None = None


class QuestionCreate(BaseModel):
    question: str = Field(min_length=5)
    options: list[str] = Field(min_length=2)
    correct_option_index: int = Field(ge=0)
    competency: str | None = None


class QuestionUpdate(BaseModel):
    question: str | None = Field(default=None, min_length=5)
    options: list[str] | None = Field(default=None, min_length=2)
    correct_option_index: int | None = Field(default=None, ge=0)
    competency: str | None = None


class AdminResetPasswordRequest(BaseModel):
    new_password: str = Field(min_length=6)
