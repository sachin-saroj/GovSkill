from dataclasses import dataclass, field
from typing import Any, Callable, TypedDict


class RuleResult(TypedDict):
    rule_name: str
    passed: bool
    field: str
    reason: str
    severity: str
    recommended_action: str


@dataclass(frozen=True)
class DocumentDefinition:
    type_id: str
    display_name: str
    detection_keywords: list[str]
    aliases: list[str] = field(default_factory=list)
    required_fields: list[str] = field(default_factory=list)
    expected_fields: list[str] = field(default_factory=list)
    field_patterns: dict[str, list[str]] = field(default_factory=dict)
    extraction_strategy: str = "hybrid_ocr_vision"
    validator: Callable[[dict[str, Any]], list[RuleResult]] = field(default=lambda data: [])
    display_metadata: dict[str, Any] = field(default_factory=dict)
    privacy_sensitivity: str = "standard"  # "standard" | "high_pii"
    is_supported: bool = True
    description: str = ""
