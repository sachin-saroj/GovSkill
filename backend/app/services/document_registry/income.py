from datetime import date
from typing import Any
from app.services.document_registry.base import DocumentDefinition, RuleResult


def validate_income_certificate(extracted_data: dict[str, Any]) -> list[RuleResult]:
    """
    STAGE 3: DETERMINISTIC VALIDATION FOR INCOME CERTIFICATES
    Sole authority for document pre-validation decisions.
    Calculates pass/fail compliance strictly using deterministic code logic.
    AI/LLMs NEVER override or decide these results.
    """
    results: list[RuleResult] = []

    # Rule 1: Name Present
    name = extracted_data.get("name")
    name_valid = bool(name and isinstance(name, str) and len(name.strip()) >= 2)
    results.append(
        {
            "rule_name": "Name present",
            "passed": name_valid,
            "field": "name",
            "reason": (
                f"Applicant name '{name}' verified on document."
                if name_valid
                else "Unable to confidently read or detect the applicant name on the document."
            ),
            "severity": "critical",
            "recommended_action": (
                "No action required."
                if name_valid
                else "Ensure the applicant's full name is printed clearly without blurring or obstruction."
            ),
        }
    )

    # Rule 2: Certificate Number Format
    cert_number = extracted_data.get("certificate_number")
    valid_format = bool(
        cert_number
        and isinstance(cert_number, str)
        and cert_number.isalnum()
        and len(cert_number) >= 6
        and any(c.isdigit() for c in cert_number)
    )
    results.append(
        {
            "rule_name": "Certificate number format",
            "passed": valid_format,
            "field": "certificate_number",
            "reason": (
                f"Certificate number '{cert_number}' matches alphanumeric standard (>=6 chars)."
                if valid_format
                else (
                    f"Certificate number '{cert_number or 'MISSING'}' is invalid. Must be alphanumeric with at least 6 characters (e.g., INC123456)."
                )
            ),
            "severity": "critical",
            "recommended_action": (
                "No action required."
                if valid_format
                else "Verify the certificate number format or check for missing digits in the scan."
            ),
        }
    )

    # Rule 3: Certificate Expiry Date Validation
    expiry_raw = extracted_data.get("expiry_date")
    expiry_valid = False
    expiry_reason = "Expiry date missing or invalid."

    if expiry_raw and isinstance(expiry_raw, str):
        try:
            parsed_date = date.fromisoformat(expiry_raw)
            today = date.today()
            if parsed_date >= today:
                expiry_valid = True
                expiry_reason = f"Certificate is valid until {expiry_raw}."
            else:
                expiry_valid = False
                expiry_reason = (
                    f"Certificate expired on {expiry_raw} (Current date: {today.isoformat()})."
                )
        except ValueError:
            expiry_valid = False
            expiry_reason = f"Invalid date format '{expiry_raw}'."
    else:
        expiry_reason = "Expiry date could not be detected on the certificate."

    results.append(
        {
            "rule_name": "Certificate not expired",
            "passed": expiry_valid,
            "field": "expiry_date",
            "reason": expiry_reason,
            "severity": "critical",
            "recommended_action": (
                "No action required."
                if expiry_valid
                else "Apply for a certificate renewal at your local Taluk/Revenue office before submission."
            ),
        }
    )

    # Rule 4: All Required Fields Extracted
    all_fields_present = bool(name_valid and valid_format and expiry_valid)
    missing_fields = []
    if not name_valid:
        missing_fields.append("Applicant Name")
    if not valid_format:
        missing_fields.append("Certificate Number")
    if not expiry_valid:
        missing_fields.append("Valid Expiry Date")

    results.append(
        {
            "rule_name": "All required fields extracted",
            "passed": all_fields_present,
            "field": "document",
            "reason": (
                "All mandatory certificate fields were successfully extracted and verified."
                if all_fields_present
                else f"Missing or unverified mandatory fields: {', '.join(missing_fields)}."
            ),
            "severity": "critical",
            "recommended_action": (
                "No action required."
                if all_fields_present
                else "Upload a high-contrast, uncropped scan showing all document headers and official seals."
            ),
        }
    )

    return results


INCOME_CERTIFICATE_DEFINITION = DocumentDefinition(
    type_id="income_certificate",
    display_name="Income Certificate",
    detection_keywords=[
        "income certificate",
        "certificate of income",
        "annual income",
        "annual family income",
        "family income",
        "gross income",
        "aadaaya",
        "aadaaya praman patra",
        "income",
    ],
    required_fields=["name", "certificate_number", "expiry_date"],
    field_patterns={
        "name": [
            r"(?:Name\s*of\s*Applicant|Applicant\s*Name|Holder\s*Name|Applicant|Holder|Name)\s*[:|-]?\s*([A-Za-z\s.]+)",
            r"(?:Shri|Smt|Kumari|Mr|Mrs|Ms)\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)",
        ],
        "certificate_number": [
            r"(?:Income\s*Certificate\s*(?:No|Number|#)|Certificate\s*(?:No|Number|#)|Cert\s*(?:No|#))\s*[:|-|#]?\s*([A-Za-z0-9/-]+)",
            r"\b(INC[A-Za-z0-9/-]{3,})\b",
            r"\b(GOV[A-Za-z0-9/-]{3,})\b",
            r"Certificate\s*[:|-]\s*([A-Za-z0-9/-]+)",
        ],
        "expiry_date": [
            r"(?:Expiry\s*Date|Valid\s*Until|Valid\s*Thru|Valid\s*Upto|Expires|Validity)\s*[:|-]?\s*(\d{4}-\d{2}-\d{2}|\d{1,2}[/.-]\d{1,2}[/.-]\d{4})",
            r"(?:Expiry\s*Date|Valid\s*Until|Valid\s*Thru|Valid\s*Upto|Expires|Validity)\s*[:|-]?\s*(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?[,]?\s+\d{4})",
        ],
    },
    validator=validate_income_certificate,
    is_supported=True,
    description="Official state revenue income verification certificate.",
)
