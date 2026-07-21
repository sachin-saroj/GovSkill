from google import genai
from app.core.config import settings


async def generate_tutor_answer(module_title: str, module_content: str, question: str) -> str:
    prompt = f"""You are an AI Tutor assisting a local government office employee.
Answer the employee's question clearly, concisely, and accurately, strictly grounded in the training module content provided below.

TRAINING MODULE TITLE: {module_title}
TRAINING MODULE CONTENT:
{module_content}

EMPLOYEE QUESTION:
{question}

Provide a helpful, direct, and professional answer based on the module content above.
"""
    if settings.GEMINI_API_KEY:
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            if response and response.text:
                return response.text.strip()
        except Exception:
            pass

    # Grounded fallback answer if GEMINI_API_KEY is unset or API call is unavailable
    q_lower = question.lower()
    if "checklist" in q_lower or "verify" in q_lower or "field" in q_lower:
        return f"Based on '{module_title}': When reviewing citizen documents, verify that Full Name, Certificate Number (alphanumeric, min 6 chars), and Expiry Date are clearly readable. Ensure the expiry date has not passed."
    elif "error" in q_lower or "mistake" in q_lower or "typo" in q_lower:
        return f"Based on '{module_title}': Common errors include name mismatches, expired certificates, and blurry OCR scans. Always verify details against official records before approving."
    elif "privacy" in q_lower or "security" in q_lower or "pii" in q_lower:
        return f"Based on '{module_title}': Always protect citizen PII and handle digital documents in strict compliance with data privacy regulations."
    else:
        return f"Regarding your question ('{question}'): As covered in '{module_title}', ensure all mandatory fields are valid, certificate numbers meet format guidelines, and documents are not expired."


async def generate_rule_explanation(failed_rule_name: str, extracted_data: dict) -> str:
    """
    AI Explanation Layer: Only ever explains a failed result that the Rule Engine
    has ALREADY produced. Never makes pass/fail decisions.
    """
    prompt = f"""You are a helpful citizen-support AI assistant for a local government portal.
A deterministic rule engine evaluated an uploaded Income Certificate and found that the following validation rule failed:

FAILED RULE NAME: {failed_rule_name}
EXTRACTED DOCUMENT FIELDS: {extracted_data}

Write a short, polite, 1-2 sentence plain-language explanation to the citizen explaining why this rule failed and what simple corrective action they should take before formal submission.
"""
    if settings.GEMINI_API_KEY:
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            if response and response.text:
                return response.text.strip()
        except Exception:
            pass

    # Deterministic plain-language fallback explanations per rule name
    if failed_rule_name == "Name present":
        return "The applicant's full name could not be detected on the uploaded certificate. Please ensure the name is clearly printed and readable."
    elif failed_rule_name == "Certificate number format":
        return "The certificate number appears invalid or missing. Ensure your certificate displays a valid alphanumeric number with at least 6 characters."
    elif failed_rule_name == "Certificate not expired":
        return "The validity period for this certificate has expired. Please obtain a recently issued or renewed Income Certificate before applying."
    elif failed_rule_name == "All required fields extracted":
        return "Some mandatory fields (Name, Certificate Number, or Expiry Date) could not be read. Please upload a clearer scan of your document."
    else:
        return f"Validation check '{failed_rule_name}' failed. Please review your document details and upload a clean, unblurred copy."

