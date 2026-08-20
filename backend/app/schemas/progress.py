import uuid
from pydantic import BaseModel, ConfigDict


class EmployeeSkillItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    module_id: uuid.UUID
    module_title: str
    lessons_completed: bool
    best_score: int
    total_questions: int
    score_percentage: int
    status: str  # "not_started", "in_progress", "completed", "certified"
    updated_at: str


class EmployeeSkillStatusResponse(BaseModel):
    overall_skill_score: int  # 0 to 100 percentage based on certified modules
    total_modules: int
    certified_modules: int
    skills: list[EmployeeSkillItem]


class AdminSkillOverviewResponse(BaseModel):
    total_employees: int
    total_certifications: int
    overall_certification_rate: int
