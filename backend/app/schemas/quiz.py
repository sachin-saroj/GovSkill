import uuid
from pydantic import BaseModel, ConfigDict


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question: str
    options: list[str]
    competency: str | None = None


class QuizQuestionsResponse(BaseModel):
    questions: list[QuestionOut]


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
