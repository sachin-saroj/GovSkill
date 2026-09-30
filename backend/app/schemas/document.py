import uuid
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class RuleResultSchema(BaseModel):
    ruleName: str = "Unknown Rule"
    passed: bool = False
    field: str | None = None
    reason: str | None = None
    severity: str | None = "critical"
    recommended_action: str | None = None
    explanation: str | None = None


class FieldDetailSchema(BaseModel):
    value: str | None = None
    confidence: float = 1.0
    status: str = "extracted"  # "extracted" | "uncertain" | "unreadable" | "missing"


class DocumentUploadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    document_id: uuid.UUID
    overall_status: str = "ACTION_REQUIRED"
    document_type: str = "income_certificate"
    display_name: str = "Income Certificate"
    extraction_source: str = "LOCAL_OCR"
    ocr_quality: str = "UNKNOWN"
    extracted_data: dict[str, Any] | None = Field(default_factory=dict)
    field_details: dict[str, FieldDetailSchema] = Field(default_factory=dict)
    validation_results: list[RuleResultSchema] | None = Field(default_factory=list)
    passed_rules_count: int = 0
    total_rules_count: int = 4
    summary: str | None = None
    detected_issues: list[str] = Field(default_factory=list)
    classification_confidence: float = 1.0
    timestamp: str | None = None
    recommended_next_step: str | None = None
