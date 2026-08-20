from typing import Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "GovSkill"
    API_V1_STR: str = "/api"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/govskill"
    GEMINI_API_KEY: str = ""
    ALLOWED_ORIGINS: Union[list[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

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

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v


settings = Settings()

