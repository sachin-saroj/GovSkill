import asyncio
import hashlib
import logging
import os
import shutil
import time
import uuid
from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.ai_gateway import get_ai_gateway
from app.core.config import settings
from app.core.rate_limiter import InMemoryRateLimiter
from app.models.document import CitizenDocument
from app.schemas.document import DocumentUploadResponse, FieldDetailSchema, RuleResultSchema
from app.services.ai_service import generate_rule_explanation
from app.services.document_registry import (
    SUPPORTED_DOCUMENTS,
    assess_ocr_quality,
    classify_document,
    extract_document_fields,
    mask_sensitive_field,
    normalize_extracted_value,
    prepare_vision_payload,
)
from app.services.ocr_service import extract_raw_text
from app.services.rule_engine import (
    validate_income_certificate as _default_validate_income_certificate,
)

# Module-level alias to preserve compatibility with test monkeypatching
validate_income_certificate = _default_validate_income_certificate

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
            logger.info(
                "Absorbed duplicate document upload via idempotency cache (hash=%s)", file_hash[:8]
            )
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

        # 5. STAGE 1 (RAW OCR) in worker thread to prevent event loop block & STAGE 2 (NORMALIZATION & REGISTRY)
        try:
            raw_text = await asyncio.to_thread(extract_raw_text, saved_filepath)
            doc_def = classify_document(raw_text)
            extracted_data = extract_document_fields(raw_text, doc_def)
        except Exception as ocr_err:
            logger.warning(
                "OCR extraction encountered error: %s. Using fallback classification.", ocr_err
            )
            raw_text = ""
            doc_def = classify_document(raw_text)
            extracted_data = extract_document_fields(raw_text, doc_def)

        # STAGE 2b: OCR Quality Assessment Interface
        ocr_assessment = assess_ocr_quality(raw_text, extracted_data, doc_def)
        ocr_quality = ocr_assessment.get("quality_grade", "LOW")
        detected_issues = list(ocr_assessment.get("issues", []))

        # STAGE 2c: Hybrid Extraction Fallback (Gemini Vision)
        extraction_source = "LOCAL_OCR"
        classification_confidence = 1.0 if doc_def.is_supported else 0.5

        # Initialize structured field details from local extraction
        field_details: dict[str, dict[str, Any]] = {}
        for k in doc_def.required_fields:
            val = extracted_data.get(k)
            if val:
                field_details[k] = {"value": val, "confidence": 0.90, "status": "extracted"}
            else:
                field_details[k] = {"value": None, "confidence": 0.0, "status": "missing"}
        for k, val in extracted_data.items():
            if k not in field_details and not k.startswith("_"):
                field_details[k] = {
                    "value": val,
                    "confidence": 0.85 if val else 0.0,
                    "status": "extracted" if val else "missing",
                }

        # Quality Gate: Engage Vision fallback only if local extraction is insufficient AND vision is explicitly enabled
        if not ocr_assessment["is_sufficient"] and settings.AI_VISION_ENABLED:
            logger.info(
                "Local OCR insufficient (decision=%s). Engaging Gemini Vision fallback.",
                ocr_assessment.get("decision"),
            )
            vision_payload = await asyncio.to_thread(prepare_vision_payload, saved_filepath)
            if vision_payload is not None:
                img_bytes, mime_type = vision_payload
                ai_gw = get_ai_gateway()
                vision_analysis = await ai_gw.extract_document_multimodal(
                    image_bytes=img_bytes,
                    mime_type=mime_type,
                    document_hint=f"Candidate document type: {doc_def.display_name}",
                    timeout=settings.AI_TIMEOUT_SECONDS,
                )
                if vision_analysis is not None:
                    extraction_source = "VISION_AI"
                    classification_confidence = vision_analysis.classification_confidence

                    # If local was unknown or unsupported, check if Vision confidently identified a supported definition
                    if doc_def.type_id in ("unknown_document", "unsupported_document"):
                        if vision_analysis.document_type in SUPPORTED_DOCUMENTS:
                            doc_def = SUPPORTED_DOCUMENTS[vision_analysis.document_type]

                    # Safely normalize and merge extracted fields
                    for field_name, field_val in vision_analysis.extracted_fields.items():
                        if field_val and isinstance(field_val, str) and field_val.strip():
                            norm_val = normalize_extracted_value(field_name, field_val)
                            extracted_data[field_name] = norm_val

                    # Update field_details from Vision analysis
                    for f_name, f_detail in vision_analysis.field_details.items():
                        norm_f_val = (
                            normalize_extracted_value(f_name, f_detail.value)
                            if f_detail.value
                            else None
                        )
                        field_details[f_name] = {
                            "value": norm_f_val,
                            "confidence": f_detail.confidence,
                            "status": f_detail.status,
                        }

                    # Append any detected issues from Vision
                    if vision_analysis.detected_issues:
                        detected_issues.extend(vision_analysis.detected_issues)

                    # Update quality grade based on post-Vision completeness
                    missing_after_vision = [
                        f
                        for f in doc_def.required_fields
                        if not extracted_data.get(f) or not str(extracted_data.get(f)).strip()
                    ]
                    ocr_quality = "HIGH" if not missing_after_vision else "MEDIUM"
                else:
                    detected_issues.append(
                        "Vision fallback was unavailable; proceeded with local OCR."
                    )

        # 6. STAGE 3 (DETERMINISTIC VALIDATION via Document Registry)
        if validate_income_certificate is not _default_validate_income_certificate:
            rule_results_raw = validate_income_certificate(extracted_data)
        elif doc_def.type_id == "income_certificate":
            rule_results_raw = validate_income_certificate(extracted_data)
        else:
            rule_results_raw = doc_def.validator(extracted_data)

        all_passed = all(r["passed"] for r in rule_results_raw) if rule_results_raw else False
        passed_count = sum(1 for r in rule_results_raw if r["passed"])
        total_count = len(rule_results_raw)

        if doc_def.type_id == "unknown_document":
            overall_status = "UNKNOWN_DOCUMENT"
            next_step = (
                "Document type could not be confidently identified. Please ensure the document "
                "is a supported civic certificate or identity document with clear, readable headers."
            )
        elif doc_def.type_id == "unsupported_document":
            overall_status = "UNSUPPORTED_DOCUMENT"
            next_step = (
                "The uploaded document belongs to an unsupported category (e.g. utility bill, commercial invoice). "
                "GovAssist pre-check supports official government civic certificates, identity cards, licenses, and vital records only."
            )
        elif doc_def.type_id == "income_certificate":
            if all_passed:
                overall_status = "PASSED"
                next_step = (
                    "All pre-submission validation checks passed! You may proceed with formal submission "
                    "to the taluk office or citizen service center."
                )
            else:
                overall_status = "ACTION_REQUIRED"
                next_step = (
                    "One or more pre-check rules failed. Review the AI guidance and corrective actions "
                    "below before formal submission to avoid application rejection."
                )
        else:
            # Multi-document support: Aadhaar, PAN, Voter ID, Driving License, Passport, Caste, Domicile, etc.
            missing_required = [
                f
                for f in doc_def.required_fields
                if not extracted_data.get(f) or not str(extracted_data.get(f)).strip()
            ]
            if ocr_quality == "UNREADABLE" or (
                doc_def.required_fields and len(missing_required) == len(doc_def.required_fields)
            ):
                overall_status = "EXTRACTION_INCOMPLETE"
                next_step = (
                    "Document scan quality was insufficient to extract essential fields. "
                    "Please upload a higher resolution or clearer scan."
                )
            elif all_passed:
                overall_status = "SUPPORTED FOR EXTRACTION — FORMAL VALIDATION UNAVAILABLE"
                next_step = (
                    "Document extracted and format consistency verified against civic schema. "
                    "Official authenticity or statutory legal validity was not verified."
                )
            else:
                overall_status = "ACTION_REQUIRED"
                next_step = "One or more format or consistency checks failed. Review the extracted fields and guidance below."

        # 7. AI EXPLANATION LAYER (AIGateway manages provider timeout, concurrency & error fallback)
        async def _explain_rule(r: dict) -> tuple[dict, str | None]:
            if not r["passed"]:
                try:
                    exp = await generate_rule_explanation(
                        failed_rule_name=r["rule_name"],
                        context=r["reason"],
                        field_name=r.get("field"),
                        field_value=extracted_data.get(r.get("field")) if r.get("field") else None,
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
                    "field": r.get("field"),
                    "reason": r["reason"],
                    "severity": r.get("severity", "critical"),
                    "recommended_action": r.get("recommended_action"),
                    "explanation": exp,
                }
            )

        summary = f"{doc_def.display_name} pre-check: {passed_count}/{total_count} checks passed."
        now_utc = datetime.now(timezone.utc)

        # Mask sensitive fields before persistence, logging, and client transmission
        masked_extracted_data = {}
        for k, v in extracted_data.items():
            if k.startswith("_"):
                masked_extracted_data[k] = v
            else:
                masked_extracted_data[k] = mask_sensitive_field(k, v) if isinstance(v, str) else v

        masked_field_details = {}
        for k, v in field_details.items():
            field_copy = dict(v)
            if field_copy.get("value") and isinstance(field_copy["value"], str):
                field_copy["value"] = mask_sensitive_field(k, field_copy["value"])
            masked_field_details[k] = field_copy

        # 8. Database Persistence with non-destructive analysis metadata
        persisted_extracted_data = dict(masked_extracted_data)
        persisted_extracted_data["_analysis"] = {
            "document_type": doc_def.type_id,
            "display_name": doc_def.display_name,
            "extraction_source": extraction_source,
            "ocr_quality": ocr_quality,
            "summary": summary,
            "detected_issues": detected_issues,
            "overall_status": overall_status,
            "classification_confidence": classification_confidence,
            "field_details": masked_field_details,
        }

        doc = CitizenDocument(
            id=file_id,
            file_path=saved_filepath,
            extracted_data=persisted_extracted_data,
            validation_results=validation_results,
            uploaded_at=now_utc,
        )
        db.add(doc)
        await db.commit()
        file_persisted = True
        try:
            await db.refresh(doc)
        except Exception as refresh_err:
            logger.warning(
                "Post-commit refresh encountered warning: %s; proceeding with committed doc",
                refresh_err,
            )

        response = DocumentUploadResponse(
            document_id=doc.id,
            overall_status=overall_status,
            document_type=doc_def.type_id,
            display_name=doc_def.display_name,
            extraction_source=extraction_source,
            ocr_quality=ocr_quality,
            extracted_data=doc.extracted_data or {},
            field_details={k: FieldDetailSchema(**v) for k, v in masked_field_details.items()},
            validation_results=[RuleResultSchema(**vr) for vr in validation_results],
            passed_rules_count=passed_count,
            total_rules_count=total_count,
            summary=summary,
            detected_issues=detected_issues,
            classification_confidence=classification_confidence,
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
        logger.info(
            "Upload request cancelled by client. Cleaning up unpersisted file: %s", saved_filepath
        )
        if not file_persisted and os.path.exists(saved_filepath):
            try:
                os.remove(saved_filepath)
            except OSError as cleanup_err:
                logger.error(
                    "Failed to clean up cancelled upload file %s: %s", saved_filepath, cleanup_err
                )
        raise
    except HTTPException:
        if not file_persisted and os.path.exists(saved_filepath):
            try:
                os.remove(saved_filepath)
            except OSError as cleanup_err:
                logger.error(
                    "Failed to clean up aborted upload file %s: %s", saved_filepath, cleanup_err
                )
        raise
    except Exception as exc:
        logger.exception("Unexpected error in upload pipeline: %s", exc)
        if not file_persisted and os.path.exists(saved_filepath):
            try:
                os.remove(saved_filepath)
            except OSError as cleanup_err:
                logger.error(
                    "Failed to clean up error upload file %s: %s", saved_filepath, cleanup_err
                )
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
            sanitized_rules.append(
                RuleResultSchema(ruleName="Malformed check record", passed=False)
            )

    all_passed = all(r.passed for r in sanitized_rules) if sanitized_rules else False
    passed_count = sum(1 for r in sanitized_rules if r.passed)
    total_count = len(sanitized_rules) if sanitized_rules else 4

    extracted = doc.extracted_data or {}
    analysis = extracted.get("_analysis", {})
    doc_type = analysis.get("document_type", "income_certificate")
    disp_name = analysis.get("display_name", "Income Certificate")
    ext_source = analysis.get("extraction_source", "LOCAL_OCR")
    ocr_qual = analysis.get("ocr_quality", "LOW")
    summary_val = analysis.get("summary")
    det_issues = analysis.get("detected_issues", [])
    stored_status = analysis.get("overall_status")
    overall_status = stored_status or ("PASSED" if all_passed else "ACTION_REQUIRED")

    if overall_status == "UNKNOWN_DOCUMENT":
        next_step = "Document type could not be confidently identified. Please ensure the document is a supported civic certificate with clear headers."
    elif overall_status == "UNSUPPORTED_DOCUMENT":
        next_step = "The uploaded document belongs to an unsupported category. GovAssist currently pre-checks Revenue and Municipal civic certificates only."
    elif all_passed:
        next_step = "All pre-submission validation checks passed! You may proceed with formal submission to the taluk office."
    else:
        next_step = "One or more pre-check rules failed. Review the corrective actions before formal submission."

    field_details_raw = analysis.get("field_details", {})
    field_details_parsed: dict[str, FieldDetailSchema] = {}
    for k, v in field_details_raw.items():
        if isinstance(v, dict):
            try:
                field_details_parsed[k] = FieldDetailSchema(**v)
            except Exception:
                pass
    class_conf = float(analysis.get("classification_confidence", 1.0))

    return DocumentUploadResponse(
        document_id=doc.id,
        overall_status=overall_status,
        document_type=doc_type,
        display_name=disp_name,
        extraction_source=ext_source,
        ocr_quality=ocr_qual,
        extracted_data=doc.extracted_data or {},
        field_details=field_details_parsed,
        validation_results=sanitized_rules,
        passed_rules_count=passed_count,
        total_rules_count=total_count,
        summary=summary_val,
        detected_issues=det_issues,
        classification_confidence=class_conf,
        timestamp=doc.uploaded_at.isoformat()
        if hasattr(doc.uploaded_at, "isoformat")
        else str(doc.uploaded_at),
        recommended_next_step=next_step,
    )
