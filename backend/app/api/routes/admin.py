from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.module import Module
from app.models.quiz import QuizAttempt
from app.models.user import User
from app.schemas.admin import AdminAttemptResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/attempts", response_model=list[AdminAttemptResponse])
async def list_quiz_attempts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "FORBIDDEN", "message": "Admin privileges required to view employee quiz scores"}},
        )

    stmt = (
        select(QuizAttempt, User.email, Module.title)
        .join(User, QuizAttempt.user_id == User.id)
        .join(Module, QuizAttempt.module_id == Module.id)
        .order_by(QuizAttempt.submitted_at.desc())
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
