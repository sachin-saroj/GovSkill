import pytest
from unittest.mock import AsyncMock, MagicMock
from app.core.ai_gateway import AIGateway
from app.core.config import Settings


def test_gateway_unconfigured():
    """Verify gateway gracefully handles missing GEMINI_API_KEY."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="",
    )
    gw = AIGateway(mock_settings)
    assert not gw.is_configured()
    assert gw.get_client() is None


def test_gateway_singleton_client():
    """Verify gateway lazily creates and caches client instance."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)
    assert gw.is_configured()
    c1 = gw.get_client()
    c2 = gw.get_client()
    assert c1 is not None
    assert c1 is c2


@pytest.mark.asyncio
async def test_gateway_generate_text_success(monkeypatch):
    """Verify text generation succeeds with valid response."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)

    mock_response = MagicMock()
    mock_response.text = "Hello from AI Gateway"

    mock_client = MagicMock()
    mock_client.models.generate_content = MagicMock(return_value=mock_response)
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
    gw._client = mock_client

    result = await gw.generate_text(prompt="Hi")
    assert result == "Hello from AI Gateway"


@pytest.mark.asyncio
async def test_gateway_generate_text_timeout(monkeypatch):
    """Verify gateway handles timeout gracefully without raising exception."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)

    def slow_call(*args, **kwargs):
        import time

        time.sleep(0.5)
        return MagicMock(text="Too late")

    mock_client = MagicMock()
    mock_client.models.generate_content = slow_call
    mock_client.aio.models.generate_content = slow_call
    gw._client = mock_client

    result = await gw.generate_text(prompt="Hi", timeout=0.05)
    assert result is None


@pytest.mark.asyncio
async def test_gateway_generate_text_exception_handled():
    """Verify gateway handles SDK error gracefully returning None."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)

    mock_client = MagicMock()
    mock_client.models.generate_content = MagicMock(side_effect=RuntimeError("API quota exhausted"))
    mock_client.aio.models.generate_content = AsyncMock(
        side_effect=RuntimeError("API quota exhausted")
    )
    gw._client = mock_client

    result = await gw.generate_text(prompt="Hi")
    assert result is None


@pytest.mark.asyncio
async def test_gateway_rule_explanation():
    """Verify rule explanation formatting and generation."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
    )
    gw = AIGateway(mock_settings)

    mock_response = MagicMock()
    mock_response.text = "Please upload a clearer image of your certificate."
    mock_client = MagicMock()
    mock_client.models.generate_content = MagicMock(return_value=mock_response)
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
    gw._client = mock_client

    explanation = await gw.generate_rule_explanation(
        failed_rule_name="Name present",
        failure_reason="Unable to read name",
    )
    assert explanation == "Please upload a clearer image of your certificate."


@pytest.mark.asyncio
async def test_gateway_multimodal_disabled():
    """Verify multimodal extraction returns None immediately when AI_VISION_ENABLED is False."""
    mock_settings = Settings(
        SECRET_KEY="test_secret_key_minimum_32_characters_long",
        CREDENTIAL_SIGNING_KEY="test_credential_key_minimum_32_chars",
        GEMINI_API_KEY="test-mock-api-key-12345",
        AI_VISION_ENABLED=False,
    )
    gw = AIGateway(mock_settings)
    result = await gw.extract_document_multimodal(b"mock_bytes", mime_type="image/png")
    assert result is None
