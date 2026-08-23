import os
import shutil
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.tests.fixtures.generate_fixtures import FIXTURES_DIR, generate_all_fixtures

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DB_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.fixture(scope="module", autouse=True)
def setup_test_fixtures():
    generate_all_fixtures()


def _is_tesseract_available() -> bool:
    if shutil.which("tesseract"):
        return True
    import pytesseract

    cmd = getattr(pytesseract.pytesseract, "tesseract_cmd", None)
    return bool(cmd and os.path.exists(cmd))


@pytest.mark.asyncio
async def test_ocr_pipeline_with_physical_pdf_fixtures():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Test valid.pdf (PDF Document Upload & PyMuPDF OCR Extraction -> Rule Engine PASS)
            valid_pdf_path = os.path.join(FIXTURES_DIR, "valid.pdf")
            with open(valid_pdf_path, "rb") as f:
                resp = await client.post(
                    "/api/documents/upload",
                    files={"file": ("valid.pdf", f, "application/pdf")},
                )
            assert resp.status_code == 200
            pdf_data = resp.json()
            assert pdf_data["extracted_data"]["name"] == "Sunita Sharma"
            assert pdf_data["extracted_data"]["certificate_number"] == "GOV12345678"
            assert pdf_data["extracted_data"]["expiry_date"] == "2028-06-30"

            # Check Rule Engine evaluation: all 4 rules pass
            all_passed_pdf = all(r["passed"] for r in pdf_data["validation_results"])
            assert all_passed_pdf is True

            # 2. Test expired.pdf (Expired Date Rule Failure)
            expired_pdf_path = os.path.join(FIXTURES_DIR, "expired.pdf")
            with open(expired_pdf_path, "rb") as f:
                resp = await client.post(
                    "/api/documents/upload",
                    files={"file": ("expired.pdf", f, "application/pdf")},
                )
            assert resp.status_code == 200
            expired_data = resp.json()
            assert expired_data["extracted_data"]["expiry_date"] == "2020-01-01"

            # Check that Certificate not expired rule failed
            expiry_rule = next(
                r
                for r in expired_data["validation_results"]
                if r["ruleName"] == "Certificate not expired"
            )
            assert expiry_rule["passed"] is False
            assert expiry_rule["explanation"] is not None

            # 3. Test missing-field.pdf (Missing Mandatory Fields Rule Failure)
            missing_pdf_path = os.path.join(FIXTURES_DIR, "missing-field.pdf")
            with open(missing_pdf_path, "rb") as f:
                resp = await client.post(
                    "/api/documents/upload",
                    files={"file": ("missing-field.pdf", f, "application/pdf")},
                )
            assert resp.status_code == 200
            missing_data = resp.json()
            name_rule = next(
                r for r in missing_data["validation_results"] if r["ruleName"] == "Name present"
            )
            assert name_rule["passed"] is False

            # 4. Test poor-quality.pdf (Unreadable Document Upload)
            poor_pdf_path = os.path.join(FIXTURES_DIR, "poor-quality.pdf")
            with open(poor_pdf_path, "rb") as f:
                resp = await client.post(
                    "/api/documents/upload",
                    files={"file": ("poor-quality.pdf", f, "application/pdf")},
                )
            assert resp.status_code == 200
            poor_data = resp.json()
            assert poor_data["extracted_data"]["name"] is None

            # 5. Conditionally Test valid.png if native Tesseract executable is installed
            if _is_tesseract_available():
                valid_png_path = os.path.join(FIXTURES_DIR, "valid.png")
                with open(valid_png_path, "rb") as f:
                    resp = await client.post(
                        "/api/documents/upload",
                        files={"file": ("valid.png", f, "image/png")},
                    )
                assert resp.status_code == 200
                png_data = resp.json()
                assert png_data["extracted_data"]["name"] == "Rajesh Kumar"

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()
