from pydantic import BaseModel, Field


class TutorChatMessage(BaseModel):
    sender: str = "user"  # "user" | "tutor" | "assistant"
    text: str = Field(max_length=2000)


class TutorAskRequest(BaseModel):
    module_id: str = "auto"
    question: str = Field(min_length=1, max_length=1000)
    mode: str = "standard"  # "standard", "simple", "procedure", "pitfalls", "remediation", "grounded_training", "general_chat"
    conversation_mode: str = "grounded_training"  # "grounded_training" | "general_chat"
    history: list[TutorChatMessage] = Field(default_factory=list)


class TutorAskResponse(BaseModel):
    answer: str
    matched_module_id: str | None = None
    matched_module_title: str
    grounding_status: str = (
        "grounded"  # "grounded", "insufficient_context", "fallback", "general_chat"
    )
    suggested_followups: list[str] = []
    source_sections: list[str] = []
    mode: str = "standard"
    conversation_mode: str = "grounded_training"
