"""add_user_token_version_and_active

Revision ID: 006_add_user_token_version_and_active
Revises: 005_add_credentials_table
Create Date: 2026-09-25 21:00:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "006_add_user_token_version_and_active"
down_revision: Union[str, None] = "005_add_credentials_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("token_version", sa.Integer(), server_default="1", nullable=False),
    )
    op.add_column(
        "users",
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
    )


def downgrade() -> None:
    op.drop_column("users", "is_active")
    op.drop_column("users", "token_version")
