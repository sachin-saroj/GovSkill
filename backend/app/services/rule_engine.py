from datetime import date
from typing import TypedDict


class RuleResult(TypedDict):
    rule_name: str
    passed: bool
    field: str
    reason: str
    severity: str
    recommended_action: str


def validate_income_certificate(extracted_data: dict) -> list[RuleResult]:
    """
    STAGE 3: DETERMINISTIC VALIDATION
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
