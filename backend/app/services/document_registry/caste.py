from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_caste_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Scaffolding validator for Caste Certificates.
    Explicitly indicates that authoritative compliance rules are pending configuration.
    Never fabricates a false PASS.
    """
    return [
        {
            "rule_name": "Document category identified",
            "passed": True,
            "field": "document_type",
            "reason": "Document identified as a Caste Certificate.",
            "severity": "info",
            "recommended_action": "No action required.",
        },
        {
            "rule_name": "Statutory rule configuration",
            "passed": False,
            "field": "document",
            "reason": (
                "Statutory pre-submission compliance rules for Caste Certificates are currently "
                "in staging and not yet enabled for automated scoring in this district."
            ),
            "severity": "warning",
            "recommended_action": (
                "Please present your original Caste Certificate directly at the Taluk / Revenue service counter."
            ),
        },
    ]


CASTE_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="caste_certificate",
    display_name="Caste Certificate",
    detection_keywords=[
        "caste certificate",
        "community certificate",
        "scheduled caste",
        "scheduled tribe",
        "other backward class",
        "category-i",
        "category-ii",
    ],
    required_fields=["name", "certificate_number", "caste_category"],
    field_patterns={
        "name": [
            r"(?:Name\s*of\s*Applicant|Applicant\s*Name|Holder\s*Name|Applicant|Holder|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "certificate_number": [
            r"(?:Caste\s*Certificate\s*(?:No|Number|#)|Certificate\s*(?:No|Number|#)|Cert\s*(?:No|#))\s*[:|-|#]?\s*([A-Za-z0-9/-]+)",
        ],
        "caste_category": [
            r"(?:Category|Caste|Sub-Caste|Community)\s*[:|-]?\s*([A-Za-z0-9\s/-]+)",
        ],
    },
    validator=validate_caste_certificate,
    is_supported=True,
    description="Official community/caste category verification certificate.",
)
