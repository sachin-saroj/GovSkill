import pytest
from app.api.routes.documents import upload_limiter, lookup_limiter, _recent_uploads


@pytest.fixture(autouse=True)
def reset_rate_limiters():
    upload_limiter.reset()
    lookup_limiter.reset()
    _recent_uploads.clear()
    yield
    upload_limiter.reset()
    lookup_limiter.reset()
    _recent_uploads.clear()
