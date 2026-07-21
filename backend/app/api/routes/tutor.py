import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.routes.modules import get_or_create_default_module
from app.models.module import Module
from app.models.user import User
from app.schemas.tutor import TutorAskRequest, TutorAskResponse
from app.services.ai_service import generate_tutor_answer

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/ask", response_model=TutorAskResponse)
async def ask_tutor(
    payload: TutorAskRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.module_id == "default":
        module = await get_or_create_default_module(db)
    else:
        try:
            mod_uuid = uuid.UUID(payload.module_id)
            result = await db.execute(select(Module).where(Module.id == mod_uuid))
            module = result.scalar_one_or_none()
            if not module:
                module = await get_or_create_default_module(db)
        except ValueError:
            module = await get_or_create_default_module(db)

    answer = await generate_tutor_answer(
        module_title=module.title,
        module_content=module.content,
        question=payload.question,
    )
    return TutorAskResponse(answer=answer)
