"""add_credentials_table

Revision ID: 005_add_credentials_table
Revises: 004_add_quiz_question_competency
Create Date: 2026-08-25 20:45:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "005_add_credentials_table"
down_revision: Union[str, None] = "004_add_quiz_question_competency"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "credentials",
        sa.Column("id", sa.Uuid(), nullable=False, primary_key=True),
        sa.Column("credential_id", sa.String(length=64), nullable=False),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("module_id", sa.Uuid(), sa.ForeignKey("modules.id", ondelete="CASCADE"), nullable=False),
        sa.Column("score_achieved", sa.Integer(), nullable=False),
        sa.Column("total_score", sa.Integer(), nullable=False),
        sa.Column("verification_hash", sa.String(length=64), nullable=False),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "module_id", name="uq_user_module_credential"),
    )
    op.create_index("ix_credentials_credential_id", "credentials", ["credential_id"], unique=True)
    op.create_index("ix_credentials_user_id", "credentials", ["user_id"])
    op.create_index("ix_credentials_module_id", "credentials", ["module_id"])


def downgrade() -> None:
    op.drop_index("ix_credentials_module_id", table_name="credentials")
    op.drop_index("ix_credentials_user_id", table_name="credentials")
    op.drop_index("ix_credentials_credential_id", table_name="credentials")
    op.drop_table("credentials")
