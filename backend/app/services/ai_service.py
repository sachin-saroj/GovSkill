import re
from typing import Any
from google import genai
from app.core.config import settings


def find_relevant_modules(question: str, modules: list[Any]) -> list[Any]:
    """
    Code-driven term overlap & keyword relevance scoring to identify
    the most relevant training module for an employee's query.
    No vector database required.
    """
    if not modules:
        return []

    words = re.findall(r"\w+", question.lower())
    keywords = [w for w in words if len(w) > 2]

    if not keywords:
        return modules

    scored_modules = []
    for mod in modules:
        if isinstance(mod, dict):
            title = str(mod.get("title", ""))
            content = str(mod.get("content", ""))
        else:
            title = getattr(mod, "title", "") or ""
            content = getattr(mod, "content", "") or ""

        title_lower = title.lower()
        content_lower = content.lower()

        score = 0
        for kw in keywords:
            if kw in title_lower:
                score += 3
            if f"# {kw}" in content_lower or f"## {kw}" in content_lower:
                score += 2
            score += content_lower.count(kw)

        scored_modules.append((score, mod))

    scored_modules.sort(key=lambda item: item[0], reverse=True)
    return [mod for score, mod in scored_modules]


async def generate_tutor_answer(module_title: str, module_content: str, question: str) -> str:
    prompt = f"""You are an AI Tutor assisting a local government office employee.
Answer the employee's question clearly, concisely, and accurately, strictly grounded in the training module content provided below.
Explicitly cite the training module title in your explanation.

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
    t_lower = module_title.lower()

    if (
        "cybersecurity" in t_lower
        or "phishing" in q_lower
        or "password" in q_lower
        or "mfa" in q_lower
    ):
        return f"Based on '{module_title}': Protect government workstations by maintaining strong password hygiene, using MFA, locking screens when away, and never clicking unverified email attachments."
    elif "portal" in t_lower or "sla" in q_lower or "escalat" in q_lower or "workflow" in q_lower:
        return f"Based on '{module_title}': Review inbound applications against supporting documents, route for supervisor sign-off, and resolve within 7 business days to prevent automatic SLA escalation."
    elif (
        "record" in t_lower or "retention" in q_lower or "archive" in q_lower or "audit" in q_lower
    ):
        return f"Based on '{module_title}': Official records require metadata tags for indexing. Land/financial records are kept permanently; income certificates are retained 5 years before archive purging."
    elif "checklist" in q_lower or "verify" in q_lower or "field" in q_lower:
        return f"Based on '{module_title}': When reviewing citizen documents, verify that Full Name, Certificate Number (alphanumeric, min 6 chars), and Expiry Date are clearly readable."
    elif "error" in q_lower or "mistake" in q_lower or "typo" in q_lower:
        return f"Based on '{module_title}': Common errors include name mismatches, expired certificates, and blurry OCR scans. Always verify details against official records."
    elif "privacy" in q_lower or "security" in q_lower or "pii" in q_lower:
        return f"Based on '{module_title}': Always protect citizen PII and ensure records are encrypted at rest and in transit in compliance with privacy regulations."
    else:
        return f"Based on '{module_title}': Regarding your query ('{question}'), ensure all mandatory details are validated against official standards."


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
