import os
from PIL import Image, ImageDraw
import fitz

FIXTURES_DIR = os.path.dirname(__file__)


def create_text_image(text_lines: list[str], file_path: str):
    doc = fitz.open()
    page = doc.new_page(width=650, height=350)
    y = 50
    for line in text_lines:
        page.insert_text(fitz.Point(40, y), line, fontsize=18)
        y += 40
    pix = page.get_pixmap(dpi=150)
    pix.save(file_path)
    doc.close()



def create_pdf(text_lines: list[str], file_path: str):
    doc = fitz.open()
    page = doc.new_page()
    y = 50
    for line in text_lines:
        page.insert_text(fitz.Point(50, y), line, fontsize=14)
        y += 30
    doc.save(file_path)
    doc.close()


def generate_all_fixtures():
    os.makedirs(FIXTURES_DIR, exist_ok=True)

    # 1. valid.png
    valid_png_path = os.path.join(FIXTURES_DIR, "valid.png")
    create_text_image(
        [
            "GOVERNMENT OF MAHARASHTRA",
            "INCOME CERTIFICATE",
            "Applicant Name: Rajesh Kumar",
            "Certificate No: INC987654",
            "Expiry Date: 2029-12-31",
        ],
        valid_png_path,
    )

    # 2. valid.pdf
    valid_pdf_path = os.path.join(FIXTURES_DIR, "valid.pdf")
    create_pdf(
        [
            "DISTRICT MAGISTRATE OFFICE",
            "INCOME CERTIFICATE",
            "Name of Applicant: Sunita Sharma",
            "Cert No: GOV12345678",
            "Valid Until: 2028-06-30",
        ],
        valid_pdf_path,
    )

    # 3. expired.png & expired.pdf
    expired_png_path = os.path.join(FIXTURES_DIR, "expired.png")
    expired_pdf_path = os.path.join(FIXTURES_DIR, "expired.pdf")
    expired_lines = [
        "GOVERNMENT INCOME CERTIFICATE",
        "Applicant Name: Ramesh Gupta",
        "Certificate No: INC112233",
        "Expiry Date: 2020-01-01",
    ]
    create_text_image(expired_lines, expired_png_path)
    create_pdf(expired_lines, expired_pdf_path)

    # 4. missing-field.png & missing-field.pdf
    missing_png_path = os.path.join(FIXTURES_DIR, "missing-field.png")
    missing_pdf_path = os.path.join(FIXTURES_DIR, "missing-field.pdf")
    missing_lines = [
        "OFFICIAL CERTIFICATE",
        "Expiry Date: 2027-01-01",
    ]
    create_text_image(missing_lines, missing_png_path)
    create_pdf(missing_lines, missing_pdf_path)

    # 5. poor-quality.png & poor-quality.pdf
    poor_png_path = os.path.join(FIXTURES_DIR, "poor-quality.png")
    poor_pdf_path = os.path.join(FIXTURES_DIR, "poor-quality.pdf")
    poor_lines = ["#@$%^&*() blurry unreadable noise text"]
    create_text_image(poor_lines, poor_png_path)
    create_pdf(poor_lines, poor_pdf_path)



    print(f"[Fixtures] Successfully generated 5 test fixture files in {FIXTURES_DIR}")


if __name__ == "__main__":
    generate_all_fixtures()
