import os
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.document import CitizenDocument
from app.schemas.document import DocumentUploadResponse, RuleResultSchema
from app.services.ai_service import generate_rule_explanation
from app.services.ocr_service import extract_raw_text, parse_structured_fields
from app.services.rule_engine import validate_income_certificate

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads")
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


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_FILE", "message": "No file uploaded"}},
        )

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_FORMAT", "message": "Only JPG, PNG, PDF, and TXT sample files are allowed"}},
        )

    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_MIME_TYPE", "message": f"Unsupported MIME type '{file.content_type}'"}},
        )

    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "FILE_READ_ERROR", "message": f"Failed to read file content: {str(e)}"}},
        )

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail={"error": {"code": "FILE_TOO_LARGE", "message": f"File size exceeds maximum allowed 5MB limit ({len(contents)} bytes)"}},
        )


    file_id = uuid.uuid4()
    saved_filename = f"{file_id}{ext}"
    saved_filepath = os.path.join(UPLOAD_DIR, saved_filename)

    try:
        with open(saved_filepath, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": {"code": "FILE_SAVE_ERROR", "message": f"Failed to save uploaded file: {str(e)}"}},
        )


    # 1. OCR Raw Text Extraction with Exception Handling
    try:
        raw_text = extract_raw_text(saved_filepath)
        extracted_data = parse_structured_fields(raw_text)
    except Exception:
        raw_text = ""
        extracted_data = {"name": None, "certificate_number": None, "expiry_date": None}

    # 2. Deterministic Rule Engine Evaluation
    rule_results_raw = validate_income_certificate(extracted_data)

    # 3. AI Explanation Layer for Failed Rules ONLY
    validation_results: list[dict] = []
    for r in rule_results_raw:
        exp = None
        if not r["passed"]:
            try:
                exp = await generate_rule_explanation(r["rule_name"], extracted_data)
            except Exception:
                exp = f"Validation check '{r['rule_name']}' failed. Please review your document details."
        validation_results.append({
            "ruleName": r["rule_name"],
            "passed": r["passed"],
            "explanation": exp,
        })

    # 4. Persist to Database (no FK to users/employees)
    doc = CitizenDocument(
        id=file_id,
        file_path=saved_filepath,
        extracted_data=extracted_data,
        validation_results=validation_results,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    return DocumentUploadResponse(
        document_id=doc.id,
        extracted_data=doc.extracted_data or {},
        validation_results=[RuleResultSchema(**vr) for vr in validation_results],
    )


@router.get("/{document_id}", response_model=DocumentUploadResponse)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
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
            detail={"error": {"code": "DOCUMENT_NOT_FOUND", "message": "Uploaded document not found"}},
        )

    return DocumentUploadResponse(
        document_id=doc.id,
        extracted_data=doc.extracted_data or {},
        validation_results=[RuleResultSchema(**vr) for vr in (doc.validation_results or [])],
    )
