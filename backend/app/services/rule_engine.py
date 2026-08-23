from datetime import date
from typing import TypedDict


class RuleResult(TypedDict):
    rule_name: str
    passed: bool


def validate_income_certificate(extracted_data: dict) -> list[RuleResult]:
    """
    Deterministic Rule Engine. Never influenced by AI — AI only explains
    a result this function has already produced.
    """
    results: list[RuleResult] = []

    name = extracted_data.get("name")
    results.append(
        {
            "rule_name": "Name present",
            "passed": bool(name and isinstance(name, str) and name.strip()),
        }
    )

    cert_number = extracted_data.get("certificate_number")
    valid_format = (
        bool(cert_number)
        and isinstance(cert_number, str)
        and cert_number.isalnum()
        and len(cert_number) >= 6
    )
    results.append(
        {
            "rule_name": "Certificate number format",
            "passed": valid_format,
        }
    )

    expiry_raw = extracted_data.get("expiry_date")
    expiry_valid = False
    if expiry_raw and isinstance(expiry_raw, str):
        try:
            expiry_valid = date.fromisoformat(expiry_raw) >= date.today()
        except ValueError:
            expiry_valid = False
    results.append(
        {
            "rule_name": "Certificate not expired",
            "passed": expiry_valid,
        }
    )

    results.append(
        {
            "rule_name": "All required fields extracted",
            "passed": all(
                [
                    bool(name and isinstance(name, str) and name.strip()),
                    bool(cert_number and isinstance(cert_number, str) and cert_number.strip()),
                    bool(expiry_raw and isinstance(expiry_raw, str) and expiry_raw.strip()),
                ]
            ),
        }
    )

    return results
