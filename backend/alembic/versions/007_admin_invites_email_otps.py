"""add_admin_invites_and_email_otps

Revision ID: 007_admin_invites_email_otps
Revises: 006_token_version_active
Create Date: 2026-10-01 20:30:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "007_admin_invites_email_otps"
down_revision: Union[str, None] = "006_token_version_active"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "admin_invites",
        sa.Column("id", sa.Uuid(), nullable=False, primary_key=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_by_user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_admin_invites_email", "admin_invites", ["email"])
    op.create_index("ix_admin_invites_token_hash", "admin_invites", ["token_hash"], unique=True)
    op.create_index("ix_admin_invites_created_by_user_id", "admin_invites", ["created_by_user_id"])

    op.create_table(
        "email_otps",
        sa.Column("id", sa.Uuid(), nullable=False, primary_key=True),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("otp_hash", sa.String(), nullable=False),
        sa.Column("purpose", sa.String(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("attempt_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_email_otps_email", "email_otps", ["email"])
    op.create_index("ix_email_otps_user_id", "email_otps", ["user_id"])
    op.create_index("ix_email_otps_purpose", "email_otps", ["purpose"])


def downgrade() -> None:
    op.drop_index("ix_email_otps_purpose", table_name="email_otps")
    op.drop_index("ix_email_otps_user_id", table_name="email_otps")
    op.drop_index("ix_email_otps_email", table_name="email_otps")
    op.drop_table("email_otps")

    op.drop_index("ix_admin_invites_created_by_user_id", table_name="admin_invites")
    op.drop_index("ix_admin_invites_token_hash", table_name="admin_invites")
    op.drop_index("ix_admin_invites_email", table_name="admin_invites")
    op.drop_table("admin_invites")
