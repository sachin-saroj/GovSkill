import pytest

from app.api.routes.auth import (
    login_email_limiter,
    login_ip_limiter,
    otp_ip_limiter,
    register_ip_limiter,
)
from app.api.routes.documents import _recent_uploads, lookup_limiter, upload_limiter
from app.tests.helpers import (
    complete_admin_login,
    complete_staff_registration,
    fetch_latest_otp,
)


@pytest.fixture(autouse=True)
def reset_rate_limiters():
    upload_limiter.reset()
    lookup_limiter.reset()
    _recent_uploads.clear()
    register_ip_limiter.reset()
    login_ip_limiter.reset()
    login_email_limiter.reset()
    otp_ip_limiter.reset()
    yield
    upload_limiter.reset()
    lookup_limiter.reset()
    _recent_uploads.clear()
    register_ip_limiter.reset()
    login_ip_limiter.reset()
    login_email_limiter.reset()
    otp_ip_limiter.reset()


@pytest.fixture
def captured_emails(monkeypatch):
    outbox = []

    async def fake_send_email(to: str, subject: str, body_text: str) -> None:
        outbox.append((to, subject, body_text))

    monkeypatch.setattr("app.services.notifier.send_email", fake_send_email)
    yield outbox

