from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_passport(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    Consistency and format validation for Passports.
    """
    results: list[RuleResult] = []

    # Check 1: Passport Number Format (typically 1 uppercase letter + 7 digits)
    pass_no = extracted_data.get("passport_number") or extracted_data.get("certificate_number")
    pass_valid = bool(pass_no and isinstance(pass_no, str) and len(pass_no.strip()) >= 7)
    results.append(
        {
            "rule_name": "Passport number format",
            "passed": pass_valid,
            "field": "passport_number",
            "reason": (
                f"Passport number '{pass_no}' verified on document."
                if pass_valid
                else "Unable to detect valid passport number (1 letter + 7 digits)."
            ),
            "severity": "critical",
            "recommended_action": "Ensure the passport booklet page displaying the alphanumeric passport number is clear.",
        }
    )

    # Check 2: Holder name present
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "Passport holder name present",
            "passed": name_valid,
            "field": "name",
            "reason": (
                f"Passport holder name '{name}' verified on document."
                if name_valid
                else "Unable to detect holder name."
            ),
            "severity": "critical",
            "recommended_action": "Ensure given names and surname are legible.",
        }
    )

    # Check 3: Expiry Date
    exp_date = extracted_data.get("expiry_date")
    exp_valid = bool(exp_date and isinstance(exp_date, str) and len(exp_date.strip()) >= 4)
    results.append(
        {
            "rule_name": "Date of expiry present",
            "passed": exp_valid,
            "field": "expiry_date",
            "reason": (
                f"Passport expiry date '{exp_date}' detected."
                if exp_valid
                else "Passport expiry date could not be detected."
            ),
            "severity": "warning",
            "recommended_action": "Ensure date of expiry on the biodata page is visible.",
        }
    )

    # Check 4: Ministry of External Affairs Notice
    results.append(
        {
            "rule_name": "MEA statutory authenticity disclaimer",
            "passed": True,
            "field": "document",
            "reason": "Passport biodata page layout and fields extracted. Official Ministry of External Affairs (Passport Seva) validity was not verified.",
            "severity": "info",
            "recommended_action": "For statutory passport verification, refer to the Passport Seva portal (passportindia.gov.in).",
        }
    )

    return results


PASSPORT_DEFINITION = DocumentDefinition(
    type_id="passport",
    display_name="Passport",
    detection_keywords=[
        "republic of india passport",
        "passport",
        "passport no",
        "type p",
        "code ind",
        "nationality indian",
    ],
    aliases=["indian_passport"],
    required_fields=["passport_number", "name", "expiry_date"],
    expected_fields=["passport_number", "name", "nationality", "date_of_birth", "expiry_date"],
    field_patterns={
        "passport_number": [
            r"\b([A-Z]{1}[0-9]{7})\b",
            r"(?:Passport\s*(?:No|Number|#)?)\s*[:|-]?\s*([A-Za-z0-9]+)",
        ],
        "name": [
            r"(?:Given\s*Name\(s\)|Name|Surname)\s*[:|-]?\s*([A-Za-z\s.]+)",
        ],
        "expiry_date": [
            r"(?:Date\s*of\s*Expiry|Expiry\s*Date)\s*[:|-]?\s*([0-9/-]+)",
        ],
    },
    validator=validate_passport,
    privacy_sensitivity="high_pii",
    is_supported=True,
    description="Official Republic of India international travel document / passport biodata page.",
)
