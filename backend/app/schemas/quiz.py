import uuid
from pydantic import BaseModel


class QuestionOut(BaseModel):
    id: uuid.UUID
    question: str
    options: list[str]

    class Config:
        from_attributes = True


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
