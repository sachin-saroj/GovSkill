import logging
import os
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import CitizenDocument

logger = logging.getLogger("govskill.retention")


async def purge_aged_documents(db: AsyncSession, retention_days: int = 30) -> dict:
    """
    Safely purges citizen documents older than the retention threshold.
    Removes physical disk files and database records in a consistent manner.
    Produces structured audit logging.
    """
    if retention_days < 1:
        raise ValueError("retention_days must be at least 1")

    cutoff_date = datetime.now(timezone.utc) - timedelta(days=retention_days)
    logger.info(
        "Initiating document retention purge for records older than %s (%d days)",
        cutoff_date.isoformat(),
        retention_days,
    )

    query = select(CitizenDocument).where(CitizenDocument.uploaded_at < cutoff_date)
    result = await db.execute(query)
    aged_docs = result.scalars().all()

    purged_count = 0
    files_deleted = 0
    bytes_reclaimed = 0
    errors: list[str] = []

    for doc in aged_docs:
        file_path = doc.file_path
        if file_path and os.path.exists(file_path):
            try:
                size = os.path.getsize(file_path)
                os.remove(file_path)
                files_deleted += 1
                bytes_reclaimed += size
            except OSError as e:
                logger.error(
                    "Failed to delete physical file %s for document %s: %s",
                    file_path,
                    doc.id,
                    e,
                )
                errors.append(f"File delete error for {doc.id}: {str(e)}")

        await db.delete(doc)
        purged_count += 1

    await db.commit()

    summary = {
        "status": "success",
        "retention_days": retention_days,
        "cutoff_date": cutoff_date.isoformat(),
        "records_purged": purged_count,
        "files_deleted": files_deleted,
        "bytes_reclaimed": bytes_reclaimed,
        "errors_count": len(errors),
        "errors": errors[:10],
    }
    logger.info(
        "Document retention purge completed: %d records purged, %d files unlinked, %d bytes reclaimed",
        purged_count,
        files_deleted,
        bytes_reclaimed,
    )
    return summary
