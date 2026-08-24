import os
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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": "FILE_READ_ERROR",
                    "message": f"Failed to read file content: {str(e)}",
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

    try:
        with open(saved_filepath, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": "FILE_SAVE_ERROR",
                    "message": f"Failed to save uploaded file: {str(e)}",
                }
            },
        )

    # 5. STAGE 1 (RAW OCR) & STAGE 2 (NORMALIZATION)
    try:
        raw_text = extract_raw_text(saved_filepath)
        extracted_data = parse_structured_fields(raw_text)
    except Exception:
        raw_text = ""
        extracted_data = {"name": None, "certificate_number": None, "expiry_date": None}

    # 6. STAGE 3 (DETERMINISTIC VALIDATION)
    rule_results_raw = validate_income_certificate(extracted_data)

    all_passed = all(r["passed"] for r in rule_results_raw)
    passed_count = sum(1 for r in rule_results_raw if r["passed"])
    total_count = len(rule_results_raw)
    overall_status = "PASSED" if all_passed else "ACTION_REQUIRED"

    # 7. AI EXPLANATION LAYER (ONLY for failed rules, with strictly minimal context)
    validation_results: list[dict] = []
    for r in rule_results_raw:
        exp = None
        if not r["passed"]:
            try:
                exp = await generate_rule_explanation(
                    failed_rule_name=r["rule_name"],
                    context=r["reason"],
                    field_name=r["field"],
                    field_value=extracted_data.get(r["field"]),
                )
            except Exception:
                exp = f"Validation check '{r['rule_name']}' failed: {r['reason']}"

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

    # 9. Persist Document Record (Isolated citizen document, no FK to users)
    doc = CitizenDocument(
        id=file_id,
        file_path=saved_filepath,
        extracted_data=extracted_data,
        validation_results=validation_results,
        uploaded_at=now_utc,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    return DocumentUploadResponse(
        document_id=doc.id,
        overall_status=overall_status,
        extracted_data=doc.extracted_data or {},
        validation_results=[RuleResultSchema(**vr) for vr in validation_results],
        passed_rules_count=passed_count,
        total_rules_count=total_count,
        timestamp=doc.uploaded_at.isoformat(),
        recommended_next_step=next_step,
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

    val_res = doc.validation_results or []
    all_passed = all(vr.get("passed", False) for vr in val_res) if val_res else False
    passed_count = sum(1 for vr in val_res if vr.get("passed", False))
    total_count = len(val_res) if val_res else 4
    overall_status = "PASSED" if all_passed else "ACTION_REQUIRED"

    if all_passed:
        next_step = "All pre-submission validation checks passed! You may proceed with formal submission to the taluk office."
    else:
        next_step = "One or more pre-check rules failed. Review the corrective actions before formal submission."

    return DocumentUploadResponse(
        document_id=doc.id,
        overall_status=overall_status,
        extracted_data=doc.extracted_data or {},
        validation_results=[RuleResultSchema(**vr) for vr in val_res],
        passed_rules_count=passed_count,
        total_rules_count=total_count,
        timestamp=doc.uploaded_at.isoformat()
        if hasattr(doc.uploaded_at, "isoformat")
        else str(doc.uploaded_at),
        recommended_next_step=next_step,
    )
