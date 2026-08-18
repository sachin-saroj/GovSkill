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


SEED_MODULES = [
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "title": DEFAULT_MODULE_TITLE,
        "content": DEFAULT_MODULE_CONTENT,
    },
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111112"),
        "title": "Government Portal Operations",
        "content": """# Lesson 1: Portal Overview & Citizen Service Workflow
Municipal and district portals process thousands of citizen requests daily. Service SLA tracking ensures timely delivery for certificates, permits, and grievance resolutions.

# Lesson 2: Application Processing & Verification Steps
1. Review inbound application details against supporting documents.
2. Route applications to designated departmental supervisors for secondary sign-off.
3. Update portal status flags ('Under Review', 'Approved', 'Rejected') promptly.

# Lesson 3: SLA Compliance & Escalation Workflow
Applications exceeding 7 business days without resolution are automatically flagged for supervisor escalation.
""",
    },
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111113"),
        "title": "Cybersecurity & Data Privacy Basics",
        "content": """# Lesson 1: Protecting Government Networks & Credentials
Government workstations contain sensitive PII. Employees must maintain strong password hygiene, multi-factor authentication (MFA), and lock screens when away from desks.

# Lesson 2: Identifying Phishing & Social Engineering
Never click unverified link attachments in external emails. Verify sender domain addresses before entering administrative portal credentials.

# Lesson 3: PII Security & Encryption
Citizen records must be encrypted at rest and in transit. Never store unencrypted Excel files containing citizen Aadhaar or bank details on personal drives.
""",
    },
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111114"),
        "title": "Digital Record Management",
        "content": """# Lesson 1: Archival Standards & Indexing
Official local government documents require standardized metadata tags (Year, Category, Issuing Office, Record ID) to enable fast retrieveability and audit logging.

# Lesson 2: Record Retention & Destruction Policy
Financial and land record documents must be retained permanently. Income certificates are retained for 5 years before scheduled archive purging.

# Lesson 3: Audit Trail & Chain of Custody
All document updates, exports, and access requests generate immutable system audit logs.
""",
    },
]


async def seed_all_default_modules(db: AsyncSession) -> list[Module]:
    result = await db.execute(select(Module))
    existing = {m.id: m for m in result.scalars().all()}
    added_any = False
    for m_data in SEED_MODULES:
        if m_data["id"] not in existing:
            mod = Module(
                id=m_data["id"],
                title=m_data["title"],
                content=m_data["content"],
            )
            db.add(mod)
            added_any = True
    if added_any:
        await db.commit()
        result = await db.execute(select(Module))
        return list(result.scalars().all())
    return list(existing.values())



async def get_or_create_default_module(db: AsyncSession) -> Module:
    modules = await seed_all_default_modules(db)
    return modules[0]


@router.get("", response_model=list[ModuleResponse])
async def list_modules(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    modules = await seed_all_default_modules(db)
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "MODULE_NOT_FOUND", "message": "Training module not found"}},
        )

    return module

