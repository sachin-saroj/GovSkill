"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-07-21 20:20:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # users table
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint("role IN ('employee', 'admin')", name="check_user_role"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # modules table
    op.create_table(
        "modules",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
    )

    # quiz_questions table
    op.create_table(
        "quiz_questions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("module_id", sa.Uuid(), sa.ForeignKey("modules.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("options", sa.JSON(), nullable=False),
        sa.Column("correct_option_index", sa.Integer(), nullable=False),
    )

    # quiz_attempts table
    op.create_table(
        "quiz_attempts",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("module_id", sa.Uuid(), sa.ForeignKey("modules.id", ondelete="CASCADE"), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("total", sa.Integer(), nullable=False),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # citizen_documents table
    op.create_table(
        "citizen_documents",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("file_path", sa.String(), nullable=False),
        sa.Column("extracted_data", sa.JSON(), nullable=True),
        sa.Column("validation_results", sa.JSON(), nullable=True),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )


def downgrade() -> None:
    op.drop_table("citizen_documents")
    op.drop_table("quiz_attempts")
    op.drop_table("quiz_questions")
    op.drop_table("modules")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
