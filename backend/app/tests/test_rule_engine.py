from datetime import date, timedelta
from app.services.rule_engine import validate_income_certificate


def test_rule_engine_all_pass():
    future_date = (date.today() + timedelta(days=365)).isoformat()
    data = {
        "name": "Rajesh Kumar",
        "certificate_number": "INC987654",
        "expiry_date": future_date,
    }
    results = validate_income_certificate(data)
    assert len(results) == 4
    assert all(r["passed"] for r in results)


def test_rule_engine_failed_name():
    future_date = (date.today() + timedelta(days=365)).isoformat()
    data = {
        "name": "",  # Empty name
        "certificate_number": "INC987654",
        "expiry_date": future_date,
    }
    results = validate_income_certificate(data)
    rule_map = {r["rule_name"]: r["passed"] for r in results}
    assert rule_map["Name present"] is False
    assert rule_map["Certificate number format"] is True
    assert rule_map["Certificate not expired"] is True
    assert rule_map["All required fields extracted"] is False


def test_rule_engine_failed_cert_format():
    future_date = (date.today() + timedelta(days=365)).isoformat()
    data = {
        "name": "Sita Verma",
        "certificate_number": "INC-12",  # Invalid symbol '-' and short length
        "expiry_date": future_date,
    }
    results = validate_income_certificate(data)
    rule_map = {r["rule_name"]: r["passed"] for r in results}
    assert rule_map["Certificate number format"] is False


def test_rule_engine_failed_expired_date():
    past_date = (date.today() - timedelta(days=1)).isoformat()
    data = {
        "name": "Amit Shah",
        "certificate_number": "INC123456",
        "expiry_date": past_date,  # Yesterday
    }
    results = validate_income_certificate(data)
    rule_map = {r["rule_name"]: r["passed"] for r in results}
    assert rule_map["Certificate not expired"] is False
