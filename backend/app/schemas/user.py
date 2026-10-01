import uuid
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class UserRegister(BaseModel):
    email: str = Field(pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    password: str = Field(min_length=6)
    role: Literal["employee", "admin"] = "employee"


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    role: str
    is_active: bool = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse | None = None


class UserChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)


class RegisterRequest(BaseModel):
    email: str = Field(pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    password: str = Field(min_length=6)


class RegisterVerifyRequest(BaseModel):
    email: str = Field(pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    otp: str = Field(pattern=r"^\d{6}$")
    password: str = Field(min_length=6)


class AdminRegisterRequest(BaseModel):
    email: str = Field(pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    password: str = Field(min_length=6)
    invite_token: str | None = None


class LoginOTPResponse(BaseModel):
    requires_otp: bool = True
    otp_session_id: uuid.UUID


class LoginOTPVerifyRequest(BaseModel):
    otp_session_id: uuid.UUID
    otp: str = Field(pattern=r"^\d{6}$")


class AdminInviteRequest(BaseModel):
    email: str = Field(pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")


class AdminInviteResponse(BaseModel):
    id: uuid.UUID
    email: str
    created_at: str
    expires_at: str
    created_by_user_id: uuid.UUID
    is_expired: bool
    is_used: bool


class MessageResponse(BaseModel):
    message: str
