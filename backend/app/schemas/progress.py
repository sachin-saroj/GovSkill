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
    readiness_state: str = "Not Started"  # "Not Started", "In Progress", "Assessment Pending", "Needs Improvement", "Operational", "Certified"
    updated_at: str
    proficiency: str = "Not Started"  # "Strong", "Developing", "Needs Attention", "Not Started"
    attempts_count: int = 0
    initial_score: int | None = None
    score_improvement_delta: int | None = None
    last_activity_at: str = "No activity"
    last_accessed_section: int = 0
    started_at: str | None = None
    completed_at: str | None = None


class UpdateSectionProgressRequest(BaseModel):
    section_index: int


class CompetencySummary(BaseModel):
    overall_score: int
    modules_completed: int
    certified_modules: int
    total_modules: int
    modules_remaining: int
    learning_status: str
    readiness_level: str
    strongest_competency: str | None = None
    weakest_competency: str | None = None
    average_assessment_score: int = 0
    readiness_criteria: list[str] = []
    readiness_explanation: str = ""


class SkillGapItem(BaseModel):
    module_id: uuid.UUID
    skill: str
    proficiency: str  # "Needs Attention", "Developing"
    current_score_pct: int
    target_threshold: int = 75
    gap_percentage: int = 0
    evidence: str
    recommended_action: str


class NextActionRecommendation(BaseModel):
    action_type: str  # "read_lesson", "take_quiz", "retake_quiz", "start_training", "all_certified"
    module_id: uuid.UUID | None = None
    module_title: str | None = None
    title: str
    description: str
    priority: str = "high"
    link: str


class AssessmentHistoryItem(BaseModel):
    attempt_id: uuid.UUID
    module_id: uuid.UUID
    module_title: str
    score: int
    total: int
    score_percentage: int
    attempt_number: int
    passed: bool
    improvement_from_previous: int | None = None
    submitted_at: str


class LearningActivityItem(BaseModel):
    activity_type: str  # "certification", "quiz_attempt", "quiz_improved", "lesson_completed", "lesson_started"
    title: str
    module_title: str
    timestamp: str
    detail: str


class EmployeeSkillStatusResponse(BaseModel):
    overall_skill_score: int  # 0 to 100 percentage based on certified modules
    total_modules: int
    certified_modules: int
    skills: list[EmployeeSkillItem]
    summary: CompetencySummary
    skill_gaps: list[SkillGapItem] = []
    recommended_action: NextActionRecommendation
    assessment_history: list[AssessmentHistoryItem] = []
    recent_activity: list[LearningActivityItem] = []


class AdminSkillOverviewResponse(BaseModel):
    total_employees: int
    total_certifications: int
    overall_certification_rate: int
    total_modules: int
    total_quiz_attempts: int
    average_quiz_score_pct: int
