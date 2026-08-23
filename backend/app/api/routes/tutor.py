import uuid
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.routes.modules import seed_all_default_modules
from app.models.module import Module
from app.models.user import User
from app.schemas.tutor import TutorAskRequest, TutorAskResponse
from app.services.ai_service import find_relevant_modules, generate_tutor_answer

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/ask", response_model=TutorAskResponse)
async def ask_tutor(
    payload: TutorAskRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    all_modules = await seed_all_default_modules(db)

    # Check if explicit module selected or auto-detect mode
    if payload.module_id in ("all", "auto", "default"):
        relevant_mods = find_relevant_modules(payload.question, all_modules)
        module = relevant_mods[0] if relevant_mods else all_modules[0]
    else:
        try:
            mod_uuid = uuid.UUID(payload.module_id)
            result = await db.execute(select(Module).where(Module.id == mod_uuid))
            module = result.scalar_one_or_none()
            if not module:
                relevant_mods = find_relevant_modules(payload.question, all_modules)
                module = relevant_mods[0] if relevant_mods else all_modules[0]
        except ValueError:
            relevant_mods = find_relevant_modules(payload.question, all_modules)
            module = relevant_mods[0] if relevant_mods else all_modules[0]

    answer = await generate_tutor_answer(
        module_title=module.title,
        module_content=module.content,
        question=payload.question,
    )
    return TutorAskResponse(answer=answer, matched_module_title=module.title)
