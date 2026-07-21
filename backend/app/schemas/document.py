import uuid
from typing import Any
from pydantic import BaseModel, Field


class RuleResultSchema(BaseModel):
    ruleName: str
    passed: bool
    explanation: str | None = None


class DocumentUploadResponse(BaseModel):
    document_id: uuid.UUID
    extracted_data: dict[str, Any] | None = Field(default_factory=dict)
    validation_results: list[RuleResultSchema] | None = Field(default_factory=list)

    class Config:
        from_attributes = True
