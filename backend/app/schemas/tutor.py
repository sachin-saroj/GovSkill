from pydantic import BaseModel, Field


class TutorAskRequest(BaseModel):
    module_id: str
    question: str = Field(min_length=2)


class TutorAskResponse(BaseModel):
    answer: str
    matched_module_title: str | None = None
