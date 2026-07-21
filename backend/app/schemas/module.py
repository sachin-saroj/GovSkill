import uuid
from pydantic import BaseModel


class ModuleResponse(BaseModel):
    id: uuid.UUID
    title: str
    content: str

    class Config:
        from_attributes = True
