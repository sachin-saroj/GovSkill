from pydantic import BaseModel


class AdminAttemptResponse(BaseModel):
    user_email: str
    module_title: str
    score: int
    total: int
    submitted_at: str

    class Config:
        from_attributes = True
