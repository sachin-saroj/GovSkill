import logging
from typing import Union

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("govskill.config")


class Settings(BaseSettings):
    PROJECT_NAME: str = "GovSkill"
    API_V1_STR: str = "/api"
    SECRET_KEY: str
    CREDENTIAL_SIGNING_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/govskill"
    DB_POOL_SIZE: int = 15
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: float = 10.0
    DB_POOL_RECYCLE: int = 1800
    GEMINI_API_KEY: str = ""
    AI_PROVIDER: str = "gemini"
    AI_MODEL: str = "gemini-2.5-flash"
    AI_TIMEOUT_SECONDS: float = 25.0
    AI_MAX_CONCURRENCY: int = 3
    AI_VISION_ENABLED: bool = False
    ALLOWED_ORIGINS: Union[list[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    BOOTSTRAP_ADMIN_EMAIL: str = ""
    FRONTEND_URL: str = "https://govskill-frontend.onrender.com"
    EMAIL_TRANSPORT: str = "console"
    ENVIRONMENT: str = "development"
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("EMAIL_TRANSPORT")
    @classmethod
    def validate_email_transport(cls, v: str) -> str:
        clean = v.strip().lower()
        if clean not in ("console", "smtp"):
            raise ValueError(f"Invalid EMAIL_TRANSPORT '{v}'. Allowed: 'console', 'smtp'.")
        return clean

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        insecure_placeholders = {
            "super_secret_jwt_key_change_in_production",
            "change_this_to_a_secure_secret_key_in_production",
            "MANDATORY_GENERATE_RANDOM_SECRET_KEY_HERE",
            "change_me",
            "secret",
        }
        if not v or v.strip() in insecure_placeholders:
            raise ValueError(
                "SECRET_KEY environment variable is missing or set to an insecure default placeholder."
            )
        return v

    @field_validator("CREDENTIAL_SIGNING_KEY")
    @classmethod
    def validate_credential_signing_key(cls, v: str) -> str:
        insecure_placeholders = {
            "super_secret_jwt_key_change_in_production",
            "change_this_to_a_secure_secret_key_in_production",
            "MANDATORY_GENERATE_RANDOM_SECRET_KEY_HERE",
            "change_me",
            "secret",
        }
        if not v or v.strip() in insecure_placeholders:
            raise ValueError(
                "CREDENTIAL_SIGNING_KEY environment variable is missing or set to an insecure default placeholder."
            )
        return v

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_database_url(cls, v: str) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+asyncpg://", 1)
            if v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
                return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    @model_validator(mode="after")
    def validate_smtp_configuration(self) -> "Settings":
        if self.EMAIL_TRANSPORT == "smtp":
            missing = []
            if not self.SMTP_HOST:
                missing.append("SMTP_HOST")
            if not self.SMTP_PORT:
                missing.append("SMTP_PORT")
            if not self.SMTP_USER:
                missing.append("SMTP_USER")
            if not self.SMTP_PASSWORD:
                missing.append("SMTP_PASSWORD")
            if not self.SMTP_FROM:
                missing.append("SMTP_FROM")
            if missing:
                raise ValueError(
                    f"EMAIL_TRANSPORT='smtp' requires all SMTP settings; missing: {', '.join(missing)}"
                )
            if self.EMAIL_TRANSPORT == "smtp" and self.SMTP_HOST and "." not in self.SMTP_HOST:
                logger.warning("SMTP_HOST '%s' looks invalid — no dot in hostname.", self.SMTP_HOST)
        return self


settings = Settings()


