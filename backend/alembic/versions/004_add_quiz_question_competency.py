"""add_quiz_question_competency

Revision ID: 004_add_quiz_question_competency
Revises: 003_add_module_progress_tracking
Create Date: 2026-08-23 20:25:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "004_add_quiz_question_competency"
down_revision: Union[str, None] = "003_add_module_progress_tracking"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "quiz_questions",
        sa.Column("competency", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("quiz_questions", "competency")
