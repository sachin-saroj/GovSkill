import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.module import Module
from app.models.user import User
from app.schemas.module import ModuleResponse

router = APIRouter(prefix="/modules", tags=["modules"])

DEFAULT_MODULE_TITLE = "Digital Document Handling"
DEFAULT_MODULE_CONTENT = """# Lesson 1: Introduction to Digital Document Handling
In local government administration, processing citizen documents efficiently and accurately is critical. Digital document handling involves capturing, validating, archiving, and indexing official records such as Income Certificates, Caste Certificates, and Residence Proofs.

# Lesson 2: Verification Checklist & Standards
When reviewing submitted citizen documents:
1. Ensure all mandatory fields (Full Name, Certificate Number, Issue Date, Expiry Date) are readable.
2. Certificate numbers must follow standard alphanumeric format and be at least 6 characters in length.
3. Expiry date must not be prior to the current date.
4. Verify issuing authority stamps and digital signatures.

# Lesson 3: Common Data Entry Errors & Prevention
- Name Mismatches: Typos or spelling variations between citizen applications and uploaded certificates.
- Expired Documents: Accepting certificates that have passed their valid period.
- Blurry Scans: Failing to check low-resolution uploads before approval.

# Lesson 4: Security & Compliance
Always ensure citizen privacy and PII protection. Documents must be stored securely and processed in compliance with data privacy regulations.
"""


async def get_or_create_default_module(db: AsyncSession) -> Module:
    result = await db.execute(select(Module).where(Module.title == DEFAULT_MODULE_TITLE))
    module = result.scalar_one_or_none()
    if not module:
        module = Module(
            id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
            title=DEFAULT_MODULE_TITLE,
            content=DEFAULT_MODULE_CONTENT,
        )
        db.add(module)
        await db.commit()
        await db.refresh(module)
    return module


@router.get("", response_model=list[ModuleResponse])
async def list_modules(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Module))
    modules = result.scalars().all()
    if not modules:
        default_mod = await get_or_create_default_module(db)
        return [default_mod]
    return modules


@router.get("/{module_id}", response_model=ModuleResponse)
async def get_module(
    module_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if module_id == "default":
        return await get_or_create_default_module(db)

    try:
        mod_uuid = uuid.UUID(module_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid module UUID format"}},
        )

    result = await db.execute(select(Module).where(Module.id == mod_uuid))
    module = result.scalar_one_or_none()

    if not module:
        # Fallback to seed default module if requesting seed UUID or not found
        default_mod = await get_or_create_default_module(db)
        if default_mod.id == mod_uuid:
            return default_mod
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "MODULE_NOT_FOUND", "message": "Training module not found"}},
        )

    return module
