import uuid
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class RuleResultSchema(BaseModel):
    ruleName: str
    passed: bool
    explanation: str | None = None


class DocumentUploadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    document_id: uuid.UUID
    extracted_data: dict[str, Any] | None = Field(default_factory=dict)
    validation_results: list[RuleResultSchema] | None = Field(default_factory=list)
