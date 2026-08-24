from pydantic import BaseModel, Field


class TutorAskRequest(BaseModel):
    module_id: str
    question: str = Field(min_length=2, max_length=1000)
    mode: str = "standard"  # "standard", "simple", "procedure", "pitfalls"


class TutorAskResponse(BaseModel):
    answer: str
    matched_module_id: str | None = None
    matched_module_title: str
    grounding_status: str = "grounded"  # "grounded", "insufficient_context", "fallback"
    suggested_followups: list[str] = []
    source_sections: list[str] = []
    mode: str = "standard"
