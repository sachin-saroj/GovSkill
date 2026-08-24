import uuid
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class RuleResultSchema(BaseModel):
    ruleName: str
    passed: bool
    field: str | None = None
    reason: str | None = None
    severity: str | None = "critical"
    recommended_action: str | None = None
    explanation: str | None = None


class DocumentUploadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    document_id: uuid.UUID
    overall_status: str = "ACTION_REQUIRED"
    extracted_data: dict[str, Any] | None = Field(default_factory=dict)
    validation_results: list[RuleResultSchema] | None = Field(default_factory=list)
    passed_rules_count: int = 0
    total_rules_count: int = 4
    timestamp: str | None = None
    recommended_next_step: str | None = None
