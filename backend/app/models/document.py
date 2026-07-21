import uuid
from datetime import datetime, timezone
from typing import Any
from sqlalchemy import DateTime, String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class CitizenDocument(Base):
    __tablename__ = "citizen_documents"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    extracted_data: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    validation_results: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
