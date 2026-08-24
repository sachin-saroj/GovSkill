import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user, get_db
from app.core.security import get_password_hash
from app.models.module import Module
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import User
from app.schemas.admin import (
    AdminAttemptResponse,
    AdminQuestionOut,
    AdminResetPasswordRequest,
    ModuleCreate,
    ModuleUpdate,
    QuestionCreate,
    QuestionUpdate,
)
from app.schemas.module import ModuleResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/attempts", response_model=list[AdminAttemptResponse])
async def list_quiz_attempts(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    stmt = (
        select(QuizAttempt, User.email, Module.title)
        .join(User, QuizAttempt.user_id == User.id)
        .join(Module, QuizAttempt.module_id == Module.id)
        .order_by(QuizAttempt.submitted_at.desc())
        .offset(offset)
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.all()

    attempts = []
    for attempt_obj, user_email, module_title in rows:
        submitted_at_str = (
            attempt_obj.submitted_at.isoformat()
            if hasattr(attempt_obj.submitted_at, "isoformat")
            else str(attempt_obj.submitted_at)
        )
        attempts.append(
            AdminAttemptResponse(
                user_email=user_email,
                module_title=module_title,
                score=attempt_obj.score,
                total=attempt_obj.total,
                submitted_at=submitted_at_str,
            )
        )

    return attempts


# --- Module CMS ---


@router.post("/modules", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
async def create_module(
    module_in: ModuleCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    mod = Module(
        id=uuid.uuid4(),
        title=module_in.title,
        content=module_in.content,
    )
    db.add(mod)
    await db.commit()
    await db.refresh(mod)
    return mod


@router.put("/modules/{module_id}", response_model=ModuleResponse)
async def update_module(
    module_id: str,
    module_in: ModuleUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        mod_uuid = uuid.UUID(module_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid module UUID format"}},
        )

    result = await db.execute(select(Module).where(Module.id == mod_uuid))
    mod = result.scalar_one_or_none()

    if not mod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "MODULE_NOT_FOUND", "message": "Module not found"}},
        )

    if module_in.title is not None:
        mod.title = module_in.title
    if module_in.content is not None:
        mod.content = module_in.content

    await db.commit()
    await db.refresh(mod)
    return mod


@router.delete("/modules/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_module(
    module_id: str,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        mod_uuid = uuid.UUID(module_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid module UUID format"}},
        )

    result = await db.execute(select(Module).where(Module.id == mod_uuid))
    mod = result.scalar_one_or_none()

    if not mod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "MODULE_NOT_FOUND", "message": "Module not found"}},
        )

    await db.delete(mod)
    await db.commit()
    return None


# --- Quiz Question CMS ---


@router.get("/modules/{module_id}/questions", response_model=list[AdminQuestionOut])
async def list_admin_module_questions(
    module_id: str,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        mod_uuid = uuid.UUID(module_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid module UUID format"}},
        )

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.module_id == mod_uuid))
    return result.scalars().all()


@router.post(
    "/modules/{module_id}/questions",
    response_model=AdminQuestionOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_quiz_question(
    module_id: str,
    q_in: QuestionCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        mod_uuid = uuid.UUID(module_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid module UUID format"}},
        )

    if q_in.correct_option_index >= len(q_in.options):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": "INVALID_OPTION_INDEX",
                    "message": "correct_option_index is out of range for options",
                }
            },
        )

    q = QuizQuestion(
        id=uuid.uuid4(),
        module_id=mod_uuid,
        question=q_in.question,
        options=q_in.options,
        correct_option_index=q_in.correct_option_index,
        competency=q_in.competency,
    )
    db.add(q)
    await db.commit()
    await db.refresh(q)
    return q


@router.put("/questions/{question_id}", response_model=AdminQuestionOut)
async def update_quiz_question(
    question_id: str,
    q_in: QuestionUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        q_uuid = uuid.UUID(question_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid question UUID format"}},
        )

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.id == q_uuid))
    q = result.scalar_one_or_none()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "QUESTION_NOT_FOUND", "message": "Quiz question not found"}},
        )

    if q_in.question is not None:
        q.question = q_in.question
    if q_in.options is not None:
        q.options = q_in.options
    if q_in.correct_option_index is not None:
        q.correct_option_index = q_in.correct_option_index
    if q_in.competency is not None:
        q.competency = q_in.competency

    if q.correct_option_index >= len(q.options):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": "INVALID_OPTION_INDEX",
                    "message": "correct_option_index is out of range for options",
                }
            },
        )

    await db.commit()
    await db.refresh(q)
    return q


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_quiz_question(
    question_id: str,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        q_uuid = uuid.UUID(question_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid question UUID format"}},
        )

    result = await db.execute(select(QuizQuestion).where(QuizQuestion.id == q_uuid))
    q = result.scalar_one_or_none()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "QUESTION_NOT_FOUND", "message": "Quiz question not found"}},
        )

    await db.delete(q)
    await db.commit()
    return None


# --- User Management / Password Reset ---


@router.post("/users/{user_id}/reset-password", response_model=UserResponse)
async def reset_user_password(
    user_id: str,
    payload: AdminResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    try:
        target_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "INVALID_ID", "message": "Invalid user UUID format"}},
        )

    result = await db.execute(select(User).where(User.id == target_uuid))
    target_user = result.scalar_one_or_none()

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": {"code": "USER_NOT_FOUND", "message": "User not found"}},
        )

    target_user.password_hash = get_password_hash(payload.new_password)
    await db.commit()
    await db.refresh(target_user)

    return target_user
