import io
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_upload_security_validations():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 1. Invalid file extension (.exe)
            bad_ext_file = (
                "malicious.exe",
                io.BytesIO(b"binary content"),
                "application/octet-stream",
            )
            resp = await ac.post("/api/documents/upload", files={"file": bad_ext_file})
            assert resp.status_code == 400
            assert resp.json()["detail"]["error"]["code"] == "INVALID_FORMAT"

            # 2. Invalid MIME type
            bad_mime_file = (
                "document.pdf",
                io.BytesIO(b"%PDF-1.4 test"),
                "application/x-executable",
            )
            resp = await ac.post("/api/documents/upload", files={"file": bad_mime_file})
            assert resp.status_code == 400
            assert resp.json()["detail"]["error"]["code"] == "INVALID_MIME_TYPE"

            # 3. Oversized file (> 5 MB)
            large_content = b"A" * (5 * 1024 * 1024 + 100)
            large_file = ("sample.txt", io.BytesIO(large_content), "text/plain")
            resp = await ac.post("/api/documents/upload", files={"file": large_file})
            assert resp.status_code == 413
            assert resp.json()["detail"]["error"]["code"] == "FILE_TOO_LARGE"

            # 4. Valid file upload (.txt sample)
            valid_content = b"Name: Rajesh Kumar\nCertificate No: INC98765\nExpiry Date: 2026-12-31"
            valid_file = ("income_cert.txt", io.BytesIO(valid_content), "text/plain")
            resp = await ac.post("/api/documents/upload", files={"file": valid_file})
            assert resp.status_code == 200
            data = resp.json()
            assert "document_id" in data
            assert data["extracted_data"]["name"] == "Rajesh Kumar"
            assert data["extracted_data"]["certificate_number"] == "INC98765"
            assert data["extracted_data"]["expiry_date"] == "2026-12-31"

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
