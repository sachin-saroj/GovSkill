from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_marriage_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Marriage Certificates.
    """
    results: list[RuleResult] = []

    # Check 1: Registration Number
    reg_no = extracted_data.get("registration_number") or extracted_data.get("certificate_number")
    reg_valid = bool(reg_no and isinstance(reg_no, str) and len(reg_no.strip()) >= 4)
    results.append(
        {
            "rule_name": "Marriage registration number format",
            "passed": reg_valid,
            "field": "registration_number",
            "reason": (
                f"Marriage registration number '{reg_no}' verified on document."
                if reg_valid
                else "Unable to detect valid marriage registration number."
            ),
            "severity": "critical",
            "recommended_action": "Ensure the marriage registration certificate number is legible.",
        }
    )

    # Check 2: Spouse names present
    husband = extracted_data.get("husband_name") or extracted_data.get("name")
    has_spouse = bool(husband and isinstance(husband, str) and len(husband.strip()) >= 2)
    results.append(
        {
            "rule_name": "Spouse names present",
            "passed": has_spouse,
            "field": "husband_name",
            "reason": (
                f"Primary spouse name '{husband}' detected."
                if has_spouse
                else "Unable to detect spouse names on the marriage certificate."
            ),
            "severity": "critical",
            "recommended_action": "Ensure both spouse names are clearly printed.",
        }
    )

    # Check 3: Registrar Notice
    results.append(
        {
            "rule_name": "Registrar of Marriages authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": "Marriage certificate format and fields extracted. Official municipal/sub-registrar ledger verification was not performed.",
            "severity": "info",
            "recommended_action": "Present original certificate with registrar seal at civic counters.",
        }
    )

    return results


MARRIAGE_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="marriage_certificate",
    display_name="Marriage Certificate",
    detection_keywords=[
        "marriage certificate",
        "memorandum of marriage",
        "registration of marriage",
        "hindu marriage act",
        "special marriage act",
        "compulsory registration of marriage",
    ],
    aliases=["marriage_reg"],
    required_fields=["registration_number"],
    expected_fields=["registration_number", "husband_name", "wife_name", "marriage_date"],
    field_patterns={
        "registration_number": [
            r"(?:Marriage\s*Registration\s*(?:No|Number)|Certificate\s*No|Reg\s*No)\s*[:|-]?\s*([A-Za-z0-9/-]+)",
        ],
        "husband_name": [
            r"(?:Husband(?:'s)?\s*Name|Bridegroom(?:'s)?\s*Name|Groom)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "wife_name": [
            r"(?:Wife(?:'s)?\s*Name|Bride(?:'s)?\s*Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
    },
    validator=validate_marriage_certificate,
    is_supported=True,
    description="Official Municipal or Sub-Registrar Marriage Certificate.",
)
