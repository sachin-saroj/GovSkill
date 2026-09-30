from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_domicile_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Scaffolding validator for Domicile / Residence Certificates.
    Explicitly indicates that authoritative compliance rules are pending configuration.
    Never fabricates a false PASS.
    """
    return [
        {
            "rule_name": "Document category identified",
            "passed": True,
            "field": "document_type",
            "reason": "Document identified as a Domicile / Residence Certificate.",
            "severity": "info",
            "recommended_action": "No action required.",
        },
        {
            "rule_name": "Statutory rule configuration",
            "passed": False,
            "field": "document",
            "reason": (
                "Statutory pre-submission compliance rules for Domicile Certificates are currently "
                "in staging and not yet enabled for automated scoring in this district."
            ),
            "severity": "warning",
            "recommended_action": (
                "Please present your original Domicile Certificate directly at the Taluk / Revenue service counter."
            ),
        },
    ]


DOMICILE_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="domicile_certificate",
    display_name="Domicile Certificate",
    detection_keywords=[
        "domicile certificate",
        "domicile verification",
        "residence certificate",
        "permanent resident",
        "resident of karnataka",
        "domicile of",
        "domicile",
    ],
    required_fields=["name", "certificate_number", "residence_address"],
    field_patterns={
        "name": [
            r"(?:Name\s*of\s*Applicant|Applicant\s*Name|Holder\s*Name|Applicant|Holder|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "certificate_number": [
            r"(?:Domicile\s*(?:No|Number|#)|Certificate\s*(?:No|Number|#)|Cert\s*(?:No|#))\s*[:|-|#]?\s*([A-Za-z0-9/-]+)",
        ],
    },
    validator=validate_domicile_certificate,
    is_supported=True,
    description="Official state residence / domicile status certificate.",
)
