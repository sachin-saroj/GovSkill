"""add_module_progress_tracking

Revision ID: 003_add_module_progress_tracking
Revises: 002_add_user_progress
Create Date: 2026-08-23 20:10:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "003_add_module_progress_tracking"
down_revision: Union[str, None] = "002_add_user_progress"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_progress",
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "user_progress",
        sa.Column(
            "last_accessed_section", sa.Integer(), nullable=False, server_default=sa.text("0")
        ),
    )
    op.add_column(
        "user_progress",
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("user_progress", "completed_at")
    op.drop_column("user_progress", "last_accessed_section")
    op.drop_column("user_progress", "started_at")
