"""add_user_progress

Revision ID: 002_add_user_progress
Revises: 001_initial_schema
Create Date: 2026-08-18 21:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "002_add_user_progress"
down_revision: Union[str, None] = "001_initial_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_progress",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("module_id", sa.Uuid(), sa.ForeignKey("modules.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lessons_completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("best_score", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("total_questions", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("status", sa.String(), nullable=False, server_default="not_started"),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("user_id", "module_id", name="uq_user_module_progress"),
    )


def downgrade() -> None:
    op.drop_table("user_progress")
