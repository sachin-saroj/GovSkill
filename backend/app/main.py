import logging
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from contextlib import asynccontextmanager
from sqlalchemy import func, select

from app.api.routes import (
    admin,
    auth,
    credentials,
    documents,
    modules,
    progress_admin,
    progress_employee,
    quiz,
    reports,
    tutor,
)
from app.core.config import settings
from app.db.session import async_session_maker, check_db_health
from app.models.user import User

logger = logging.getLogger("govskill")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.EMAIL_TRANSPORT == "console" and settings.ENVIRONMENT == "production":
        logger.warning("EMAIL_TRANSPORT is set to 'console' in production environment.")
    try:
        async with async_session_maker() as session:
            admin_count = (
                await session.execute(select(func.count(User.id)).where(User.role == "admin"))
            ).scalar() or 0
            if admin_count == 0 and not settings.BOOTSTRAP_ADMIN_EMAIL:
                logger.warning(
                    "No bootstrap admin configured and no admin exists in the database. Admin registration is currently impossible."
                )
    except Exception:
        pass
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = (
        errors[0].get("msg", "Invalid request body or parameters") if errors else "Validation error"
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": {"code": "VALIDATION_ERROR", "message": msg}},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(
        "Database exception processing %s %s: %s",
        request.method,
        request.url.path,
        exc,
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": {
                "code": "DATABASE_ERROR",
                "message": "Database service is temporarily unavailable. Please retry shortly.",
            }
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(
        "Unhandled server exception processing %s %s: %s",
        request.method,
        request.url.path,
        exc,
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please retry later.",
            }
        },
    )


app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(modules.router, prefix=settings.API_V1_STR)
app.include_router(tutor.router, prefix=settings.API_V1_STR)
app.include_router(quiz.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(progress_employee.router, prefix=settings.API_V1_STR)
app.include_router(progress_admin.router, prefix=settings.API_V1_STR)
app.include_router(credentials.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["health"])
async def health_check():
    db_healthy = await check_db_health()
    if not db_healthy:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "degraded",
                "app": settings.PROJECT_NAME,
                "database": "disconnected",
            },
        )
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "database": "connected",
    }
