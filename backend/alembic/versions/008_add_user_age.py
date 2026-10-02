"""add_user_age

Revision ID: 008_add_user_age
Revises: 007_admin_invites_email_otps
Create Date: 2026-10-02 20:30:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "008_add_user_age"
down_revision: Union[str, None] = "007_admin_invites_email_otps"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("age", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "age")
