import uuid
from pydantic import BaseModel, ConfigDict


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question: str
    options: list[str]


class QuizQuestionsResponse(BaseModel):
    questions: list[QuestionOut]


class QuizAnswerSubmission(BaseModel):
    question_id: uuid.UUID
    selected_option_index: int


class QuizSubmitRequest(BaseModel):
    answers: list[QuizAnswerSubmission]


class QuizSubmitResponse(BaseModel):
    score: int
    total: int
