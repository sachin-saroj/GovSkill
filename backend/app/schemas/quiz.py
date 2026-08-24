import uuid
from pydantic import BaseModel, ConfigDict


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question: str
    options: list[str]
    competency: str | None = None


class AdaptiveMeta(BaseModel):
    is_adaptive: bool = False
    focus_competencies: list[str] = []
    message: str = ""


class QuizQuestionsResponse(BaseModel):
    questions: list[QuestionOut]
    adaptive_meta: AdaptiveMeta | None = None


class QuizAnswerSubmission(BaseModel):
    question_id: uuid.UUID
    selected_option_index: int


class QuizSubmitRequest(BaseModel):
    answers: list[QuizAnswerSubmission]


class CompetencyScoreItem(BaseModel):
    competency: str
    score: int
    total: int
    percentage: int
    passed: bool
    mastery_level: str = "Developing"  # "Mastered", "Operational", "Developing"


class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    percentage: int
    passed: bool
    attempt_number: int
    best_score: int
    status: str
    competency_breakdown: list[CompetencyScoreItem]
    strengths: list[str]
    weak_areas: list[str]
    recommended_action: str
    submitted_at: str
