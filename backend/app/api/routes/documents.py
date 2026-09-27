import asyncio
import hashlib
import logging
import os
import shutil
import time
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.rate_limiter import InMemoryRateLimiter
from app.models.document import CitizenDocument
from app.schemas.document import DocumentUploadResponse, RuleResultSchema
from app.services.ai_service import generate_rule_explanation
from app.services.ocr_service import extract_raw_text, parse_structured_fields
from app.services.rule_engine import validate_income_certificate

logger = logging.getLogger("govskill.documents")

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf", ".txt"}
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "text/plain",
    "application/octet-stream",
}

# Rate limiters for public endpoints
upload_limiter = InMemoryRateLimiter(max_requests=20, window_seconds=60)
lookup_limiter = InMemoryRateLimiter(max_requests=60, window_seconds=60)
# Concurrency throttle to prevent Gemini provider burst / 429 quota exhaustion
_ai_semaphore = asyncio.Semaphore(2)

# Recent upload idempotency cache (SHA-256 -> (timestamp, DocumentUploadResponse)) to absorb double-clicks
_recent_uploads: dict[str, tuple[float, DocumentUploadResponse]] = {}


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _rate_limit: None = Depends(upload_limiter),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_FILE", "message": "No file uploaded"}},
        )

    # 1. Strict Extension Whitelist & Path Traversal Prevention
    clean_filename = os.path.basename(file.filename)
    ext = os.path.splitext(clean_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": "INVALID_FORMAT",
                    "message": "Only JPG, PNG, PDF, and TXT sample files are allowed",
                }
            },
        )

    # 2. MIME Type Validation
    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": "INVALID_MIME_TYPE",
                    "message": f"Unsupported MIME type '{file.content_type}'",
                }
            },
        )

    # 3. Read Content & Enforce Max 5MB Limit
    try:
        contents = await file.read()
    except Exception as e:
        logger.warning("Failed to read upload payload: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": "FILE_READ_ERROR",
                    "message": "Unable to read uploaded file payload.",
                }
            },
        )

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail={
                "error": {
                    "code": "FILE_TOO_LARGE",
                    "message": f"File size exceeds maximum allowed 5MB limit ({len(contents)} bytes)",
                }
            },
        )

    # Pre-flight disk space verification (Scenario 15: prevent disk exhaustion crashes)
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        disk_stats = shutil.disk_usage(UPLOAD_DIR)
        if disk_stats.free < 20 * 1024 * 1024:
            logger.error("Storage disk capacity critical: %s bytes free", disk_stats.free)
            raise HTTPException(
                status_code=status.HTTP_507_INSUFFICIENT_STORAGE,
                detail={
                    "error": {
                        "code": "STORAGE_EXHAUSTED",
                        "message": "Storage system is temporarily full. Please try again later.",
                    }
                },
            )
    except HTTPException:
        raise
    except Exception as disk_err:
        logger.error("Failed to verify storage directory availability: %s", disk_err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": "FILE_SAVE_ERROR",
                    "message": "Storage service is temporarily unavailable. Could not save uploaded file.",
                }
            },
        )

    # Scenario 18: Concurrency & Duplicate Submission Idempotency (absorb rapid double-clicks)
    file_hash = hashlib.sha256(contents).hexdigest()
    now_ts = time.time()
    if file_hash in _recent_uploads:
        cached_ts, cached_resp = _recent_uploads[file_hash]
        if now_ts - cached_ts < 15.0:
            logger.info("Absorbed duplicate document upload via idempotency cache (hash=%s)", file_hash[:8])
            return cached_resp
        else:
            _recent_uploads.pop(file_hash, None)

    # 4. Isolated File Storage using UUID
    file_id = uuid.uuid4()
    saved_filename = f"{file_id}{ext}"
    saved_filepath = os.path.abspath(os.path.join(UPLOAD_DIR, saved_filename))

    # Guard against directory escape
    if not saved_filepath.startswith(UPLOAD_DIR):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_PATH", "message": "Invalid file destination path"}},
        )

    file_persisted = False
    try:
        try:
            with open(saved_filepath, "wb") as f:
                f.write(contents)
        except Exception as e:
            logger.error("Failed to save uploaded file to disk: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "error": {
                        "code": "FILE_SAVE_ERROR",
                        "message": "Storage service is temporarily unavailable. Could not save uploaded file.",
                    }
                },
            )

        # 5. STAGE 1 (RAW OCR) in worker thread to prevent event loop block & STAGE 2 (NORMALIZATION)
        try:
            raw_text = await asyncio.to_thread(extract_raw_text, saved_filepath)
            extracted_data = parse_structured_fields(raw_text)
        except Exception as ocr_err:
            logger.warning("OCR extraction encountered error: %s. Using blank extraction.", ocr_err)
            raw_text = ""
            extracted_data = {"name": None, "certificate_number": None, "expiry_date": None}

        # 6. STAGE 3 (DETERMINISTIC VALIDATION)
        rule_results_raw = validate_income_certificate(extracted_data)

        all_passed = all(r["passed"] for r in rule_results_raw)
        passed_count = sum(1 for r in rule_results_raw if r["passed"])
        total_count = len(rule_results_raw)
        overall_status = "PASSED" if all_passed else "ACTION_REQUIRED"

        # 7. AI EXPLANATION LAYER (Parallelized non-blocking execution with bounded concurrency)
        async def _explain_rule(r: dict) -> tuple[dict, str | None]:
            if not r["passed"]:
                async with _ai_semaphore:
                    try:
                        exp = await generate_rule_explanation(
                            failed_rule_name=r["rule_name"],
                            context=r["reason"],
                            field_name=r["field"],
                            field_value=extracted_data.get(r["field"]),
                        )
                    except Exception as exc:
                        logger.warning("Rule explanation failed for '%s': %s", r["rule_name"], exc)
                        exp = f"Validation check '{r['rule_name']}' failed: {r['reason']}"
                return r, exp
            return r, None

        explained_results = await asyncio.gather(*[_explain_rule(r) for r in rule_results_raw])

        validation_results: list[dict] = []
        for r, exp in explained_results:
            validation_results.append(
                {
                    "ruleName": r["rule_name"],
                    "passed": r["passed"],
                    "field": r["field"],
                    "reason": r["reason"],
                    "severity": r["severity"],
                    "recommended_action": r["recommended_action"],
                    "explanation": exp,
                }
            )

        # 8. Recommendation
        if all_passed:
            next_step = "All pre-submission validation checks passed! You may proceed with formal submission to the taluk office or citizen service center."
        else:
            next_step = "One or more pre-check rules failed. Review the AI guidance and corrective actions below before formal submission to avoid application rejection."

        now_utc = datetime.now(timezone.utc)

        # 9. Database Persistence (Connection checkout only occurs upon transaction execution)
        doc = CitizenDocument(
            id=file_id,
            file_path=saved_filepath,
            extracted_data=extracted_data,
            validation_results=validation_results,
            uploaded_at=now_utc,
        )
        db.add(doc)
        await db.commit()
        file_persisted = True
        try:
            await db.refresh(doc)
        except Exception as refresh_err:
            logger.warning("Post-commit refresh encountered warning: %s; proceeding with committed doc", refresh_err)

        response = DocumentUploadResponse(
            document_id=doc.id,
            overall_status=overall_status,
            extracted_data=doc.extracted_data or {},
            validation_results=[RuleResultSchema(**vr) for vr in validation_results],
            passed_rules_count=passed_count,
            total_rules_count=total_count,
            timestamp=doc.uploaded_at.isoformat(),
            recommended_next_step=next_step,
        )

        # Store in idempotency cache and prune stale entries
        _recent_uploads[file_hash] = (time.time(), response)
        if len(_recent_uploads) > 500:
            expired_keys = [k for k, (ts, _) in _recent_uploads.items() if time.time() - ts > 30.0]
            for k in expired_keys:
                _recent_uploads.pop(k, None)

        return response

    except asyncio.CancelledError:
        logger.info("Upload request cancelled by client. Cleaning up unpersisted file: %s", saved_filepath)
        if not file_persisted and os.path.exists(saved_filepath):
            try:
                os.remove(saved_filepath)
            except OSError as cleanup_err:
                logger.error("Failed to clean up cancelled upload file %s: %s", saved_filepath, cleanup_err)
        raise
    except HTTPException:
        if not file_persisted and os.path.exists(saved_filepath):
            try:
                os.remove(saved_filepath)
            except OSError as cleanup_err:
                logger.error("Failed to clean up aborted upload file %s: %s", saved_filepath, cleanup_err)
        raise
    except Exception as exc:
        logger.exception("Unexpected error in upload pipeline: %s", exc)
        if not file_persisted and os.path.exists(saved_filepath):
            try:
                os.remove(saved_filepath)
            except OSError as cleanup_err:
                logger.error("Failed to clean up error upload file %s: %s", saved_filepath, cleanup_err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": "DOCUMENT_PROCESSING_ERROR",
                    "message": "An error occurred while validating the document. Please try again.",
                }
            },
        )


@router.get("/{document_id}", response_model=DocumentUploadResponse)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    _rate_limit: None = Depends(lookup_limiter),
):
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid document UUID format"}},
        )

    result = await db.execute(select(CitizenDocument).where(CitizenDocument.id == doc_uuid))
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {"code": "DOCUMENT_NOT_FOUND", "message": "Uploaded document not found"}
            },
        )

    raw_val_res = doc.validation_results or []
    sanitized_rules: list[RuleResultSchema] = []
    for item in raw_val_res:
        if isinstance(item, dict):
            rule_name = item.get("ruleName") or item.get("rule_name") or "Unknown Rule"
            passed = bool(item.get("passed", False))
            sanitized_rules.append(
                RuleResultSchema(
                    ruleName=str(rule_name),
                    passed=passed,
                    field=item.get("field"),
                    reason=item.get("reason"),
                    severity=item.get("severity", "critical"),
                    recommended_action=item.get("recommended_action"),
                    explanation=item.get("explanation"),
                )
            )
        else:
            sanitized_rules.append(RuleResultSchema(ruleName="Malformed check record", passed=False))

    all_passed = all(r.passed for r in sanitized_rules) if sanitized_rules else False
    passed_count = sum(1 for r in sanitized_rules if r.passed)
    total_count = len(sanitized_rules) if sanitized_rules else 4
    overall_status = "PASSED" if all_passed else "ACTION_REQUIRED"

    if all_passed:
        next_step = "All pre-submission validation checks passed! You may proceed with formal submission to the taluk office."
    else:
        next_step = "One or more pre-check rules failed. Review the corrective actions before formal submission."

    return DocumentUploadResponse(
        document_id=doc.id,
        overall_status=overall_status,
        extracted_data=doc.extracted_data or {},
        validation_results=sanitized_rules,
        passed_rules_count=passed_count,
        total_rules_count=total_count,
        timestamp=doc.uploaded_at.isoformat()
        if hasattr(doc.uploaded_at, "isoformat")
        else str(doc.uploaded_at),
        recommended_next_step=next_step,
    )
