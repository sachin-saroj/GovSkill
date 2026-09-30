import asyncio
import logging
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from app.core.config import Settings, settings

logger = logging.getLogger("govskill.ai.gateway")


class MultimodalExtractedField(BaseModel):
    value: str | None = None
    confidence: float = 1.0
    status: str = "extracted"  # "extracted" | "uncertain" | "unreadable" | "missing"


class MultimodalDocumentAnalysis(BaseModel):
    document_type: str = "income_certificate"
    display_name: str = "Income Certificate"
    classification_confidence: float = 1.0
    extracted_fields: dict[str, str | None] = Field(default_factory=dict)
    field_details: dict[str, MultimodalExtractedField] = Field(default_factory=dict)
    anomalies: list[str] = Field(default_factory=list)
    detected_issues: list[str] = Field(default_factory=list)
    summary: str = ""


class AIGateway:
    """
    Central AI Gateway for GovSkill.
    Owns the Gemini SDK client lifecycle, concurrency throttling,
    timeouts, and safe error normalization.
    """

    def __init__(self, app_settings: Settings | None = None) -> None:
        self.settings = app_settings or settings
        self._client: genai.Client | None = None
        self._semaphore: asyncio.Semaphore | None = None

    @property
    def semaphore(self) -> asyncio.Semaphore:
        """Lazily initialize asyncio.Semaphore within the active event loop."""
        if self._semaphore is None:
            self._semaphore = asyncio.Semaphore(self.settings.AI_MAX_CONCURRENCY)
        return self._semaphore

    def is_configured(self) -> bool:
        """Returns True if the canonical Gemini API key is configured."""
        return bool(self.settings.GEMINI_API_KEY and self.settings.GEMINI_API_KEY.strip())

    def get_client(self) -> genai.Client | None:
        """
        Lazily creates and returns the singleton genai.Client instance.
        Returns None if GEMINI_API_KEY is not configured.
        """
        if not self.is_configured() and self._client is None:
            return None
        cached_key = getattr(self, "_cached_api_key", None)
        if self._client is None or (
            cached_key is not None and cached_key != self.settings.GEMINI_API_KEY
        ):
            self._client = genai.Client(api_key=self.settings.GEMINI_API_KEY)
            self._cached_api_key = self.settings.GEMINI_API_KEY
        return self._client

    def _get_candidate_models(self) -> list[str]:
        """Returns prioritized candidate models with deduplication."""
        candidates = [
            self.settings.AI_MODEL,
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite",
            "gemini-3.8-flash",
        ]
        seen = set()
        res = []
        for c in candidates:
            if c and c not in seen:
                seen.add(c)
                res.append(c)
        return res

    async def generate_text(
        self,
        prompt: str,
        system_instruction: str | None = None,
        history: list[dict[str, str]] | None = None,
        timeout: float | None = None,
    ) -> str | None:
        """
        Generates text using candidate Gemini models under concurrency and timeout bounds.
        Supports optional conversational history context.
        Returns the stripped response text or None if generation fails or is unconfigured.
        """
        client = self.get_client()
        if client is None:
            return None

        effective_timeout = timeout or self.settings.AI_TIMEOUT_SECONDS

        history_context = ""
        if history:
            bounded_history = history[-8:]
            history_lines = []
            for item in bounded_history:
                sender_raw = str(item.get("sender", "")).lower()
                sender_label = "User" if sender_raw == "user" else "Assistant"
                text_content = str(item.get("text", "")).strip()
                if text_content:
                    history_lines.append(f"{sender_label}: {text_content}")
            if history_lines:
                history_context = "Conversation History:\n" + "\n".join(history_lines) + "\n\n"

        prompt_body = (
            f"{history_context}Current User Message:\n{prompt}" if history_context else prompt
        )

        full_prompt = prompt_body
        if system_instruction:
            full_prompt = f"{system_instruction}\n\n{prompt_body}"

        candidate_models = self._get_candidate_models()

        def _sync_generate() -> str | None:
            for model_name in candidate_models:
                try:
                    resp = client.models.generate_content(
                        model=model_name,
                        contents=full_prompt,
                    )
                    if resp and getattr(resp, "text", None):
                        return resp.text.strip()
                except Exception as exc:
                    err_msg = str(exc)
                    if (
                        "404" in err_msg
                        or "503" in err_msg
                        or "UNAVAILABLE" in err_msg
                        or "NOT_FOUND" in err_msg
                    ):
                        logger.warning(
                            "Model '%s' failed (%s: %s). Trying next candidate.",
                            model_name,
                            type(exc).__name__,
                            exc,
                        )
                        continue
                    logger.warning(
                        "AI generation call failed on model '%s' (%s: %s).",
                        model_name,
                        type(exc).__name__,
                        exc,
                    )
                    return None
            return None

        async with self.semaphore:
            try:
                return await asyncio.wait_for(
                    asyncio.to_thread(_sync_generate),
                    timeout=effective_timeout,
                )
            except asyncio.TimeoutError:
                logger.warning(
                    "AI generation timed out after %.1fs.",
                    effective_timeout,
                )
                return None
            except Exception as exc:
                logger.warning(
                    "AI generation call failed (%s: %s).",
                    type(exc).__name__,
                    exc,
                )
                return None

    async def generate_rule_explanation(
        self,
        failed_rule_name: str,
        failure_reason: str,
        timeout: float | None = 10.0,
    ) -> str | None:
        """
        Generates a concise, plain-language citizen explanation for a failed compliance rule.
        Strictly receives only rule name and failure reason to preserve citizen privacy.
        """
        prompt = (
            f"You are a helpful citizen-support AI assistant for a local government portal.\n"
            f"A deterministic compliance rule engine evaluated an uploaded certificate and found "
            f"that the following check failed:\n\n"
            f"FAILED RULE: {failed_rule_name}\n"
            f"FAILURE DETAIL: {failure_reason or 'Field check failed validation criteria.'}\n\n"
            f"Write a short, polite, 1-2 sentence plain-language explanation to the citizen explaining "
            f"why this rule failed and what simple corrective action they should take before formal submission.\n"
            f"Do NOT decide whether the document passes or fails—simply explain the rule failure clearly."
        )
        return await self.generate_text(prompt=prompt, timeout=timeout)

    async def extract_document_multimodal(
        self,
        image_bytes: bytes,
        mime_type: str = "image/png",
        document_hint: str = "",
        timeout: float | None = None,
    ) -> MultimodalDocumentAnalysis | None:
        """
        Extracts structured document fields using Gemini Vision under strict concurrency and privacy constraints.
        Only executed when AI_VISION_ENABLED is True and local extraction is insufficient.
        Never decides document compliance (deterministic rule engines hold sole authority).
        """
        if not self.settings.AI_VISION_ENABLED:
            logger.info("Vision extraction skipped: AI_VISION_ENABLED is False.")
            return None

        client = self.get_client()
        if client is None:
            logger.info("Vision extraction skipped: Gemini client unconfigured.")
            return None

        effective_timeout = timeout or self.settings.AI_TIMEOUT_SECONDS

        prompt = (
            "You are an expert document data extraction engine for a local government civic portal.\n"
            "Analyze the attached civic document image and extract visible information into structured JSON.\n\n"
            "STRICT EXTRACTION RULES:\n"
            "1. Extract ONLY visible information printed on the document. NEVER invent, guess, or extrapolate values.\n"
            "2. If a field is unreadable, blurry, or missing, set its value to null.\n"
            "3. For 'name', extract the full applicant/child name without noise words or prefixes.\n"
            "4. For 'certificate_number', extract the exact alphanumeric identifier. Do NOT alter digits or characters.\n"
            "5. For dates, format as YYYY-MM-DD if clearly readable, otherwise set to null.\n"
            "6. Classify document_type into one of: 'income_certificate', 'caste_certificate', 'domicile_certificate', "
            "'residence_certificate', 'birth_certificate', 'aadhaar', 'pan', 'voter_id', 'driving_license', 'passport', "
            "'education_certificate', 'marriage_certificate', 'disability_certificate', 'unknown_document', 'unsupported_document'.\n"
            "7. For each field in field_details, assign confidence (0.0 to 1.0) and status ('extracted', 'uncertain', 'unreadable', 'missing').\n"
            "8. DO NOT determine or judge whether this document passes or is valid. Only extract visible text.\n\n"
            "Return valid JSON formatted with these exact keys:\n"
            "{\n"
            '  "document_type": "income_certificate",\n'
            '  "display_name": "Income Certificate",\n'
            '  "classification_confidence": 1.0,\n'
            '  "extracted_fields": {"name": "...", "certificate_number": "...", "expiry_date": "YYYY-MM-DD"},\n'
            '  "field_details": {\n'
            '    "name": {"value": "...", "confidence": 1.0, "status": "extracted"},\n'
            '    "certificate_number": {"value": "...", "confidence": 1.0, "status": "extracted"},\n'
            '    "expiry_date": {"value": "...", "confidence": 1.0, "status": "extracted"}\n'
            "  },\n"
            '  "anomalies": [],\n'
            '  "detected_issues": [],\n'
            '  "summary": "..."\n'
            "}"
        )
        if document_hint:
            prompt += f"\nContext hint from initial analysis: {document_hint}"

        candidate_models = self._get_candidate_models()

        def _sync_vision() -> MultimodalDocumentAnalysis | None:
            import re

            image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            for model_name in candidate_models:
                try:
                    resp = client.models.generate_content(
                        model=model_name,
                        contents=[image_part, prompt],
                    )
                    if resp and getattr(resp, "text", None):
                        raw_text = resp.text.strip()
                        m = re.search(r"\{.*\}", raw_text, re.DOTALL)
                        if m:
                            json_str = m.group(0)
                            try:
                                return MultimodalDocumentAnalysis.model_validate_json(json_str)
                            except Exception as parse_err:
                                logger.warning(
                                    "Failed to validate Vision JSON output against schema: %s",
                                    parse_err,
                                )
                                continue
                except Exception as exc:
                    err_msg = str(exc)
                    if (
                        "404" in err_msg
                        or "503" in err_msg
                        or "UNAVAILABLE" in err_msg
                        or "NOT_FOUND" in err_msg
                    ):
                        logger.warning(
                            "Vision model '%s' failed (%s: %s). Trying next candidate.",
                            model_name,
                            type(exc).__name__,
                            exc,
                        )
                        continue
                    logger.warning(
                        "Gemini Vision call failed on model '%s' (%s: %s).",
                        model_name,
                        type(exc).__name__,
                        exc,
                    )
                    return None
            return None

        async with self.semaphore:
            try:
                return await asyncio.wait_for(
                    asyncio.to_thread(_sync_vision),
                    timeout=effective_timeout,
                )
            except asyncio.TimeoutError:
                logger.warning(
                    "Gemini Vision call timed out after %.1fs. Degrading to local extraction.",
                    effective_timeout,
                )
                return None
            except Exception as exc:
                logger.warning(
                    "Gemini Vision call failed (%s: %s). Degrading to local extraction.",
                    type(exc).__name__,
                    exc,
                )
                return None


# Global singleton instance for application use
_ai_gateway: AIGateway | None = None


def get_ai_gateway() -> AIGateway:
    """Returns the central AIGateway singleton instance."""
    global _ai_gateway
    if _ai_gateway is None:
        _ai_gateway = AIGateway(settings)
    return _ai_gateway


ai_gateway: AIGateway = get_ai_gateway()
