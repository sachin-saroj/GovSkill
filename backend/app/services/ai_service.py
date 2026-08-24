import re
from typing import Any
from google import genai
from app.core.config import settings


def extract_module_sections(content: str) -> list[str]:
    """Extract section titles (e.g. 'Lesson 1: Introduction...') from markdown content."""
    lines = content.splitlines()
    sections = []
    for line in lines:
        if line.strip().startswith("# "):
            title = line.strip().lstrip("#").strip()
            if title:
                sections.append(title)
    return sections


STOP_WORDS = {
    "the",
    "and",
    "for",
    "that",
    "this",
    "with",
    "from",
    "are",
    "was",
    "were",
    "been",
    "have",
    "has",
    "had",
    "what",
    "when",
    "where",
    "which",
    "who",
    "whom",
    "whose",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "can",
    "will",
    "just",
    "should",
    "now",
    "into",
    "onto",
    "about",
    "above",
    "after",
    "again",
    "against",
    "below",
    "between",
    "down",
    "during",
    "out",
    "over",
    "under",
    "then",
    "there",
    "their",
    "they",
    "them",
    "these",
    "those",
    "you",
    "your",
    "yours",
    "our",
    "ours",
    "please",
    "give",
    "tell",
    "explain",
    "does",
    "did",
}


def score_module_relevance(question: str, mod: Any) -> tuple[int, list[str]]:
    """
    Compute term overlap score and matching section headers for a module using exact token matching.
    """
    if isinstance(mod, dict):
        title = str(mod.get("title", ""))
        content = str(mod.get("content", ""))
    else:
        title = getattr(mod, "title", "") or ""
        content = getattr(mod, "content", "") or ""

    q_words = re.findall(r"\w+", question.lower())
    keywords = [w for w in q_words if len(w) > 2 and w not in STOP_WORDS]
    if not keywords:
        return 0, []

    title_words = set(re.findall(r"\w+", title.lower()))
    content_words = re.findall(r"\w+", content.lower())
    content_word_counts: dict[str, int] = {}
    for w in content_words:
        content_word_counts[w] = content_word_counts.get(w, 0) + 1

    sections = extract_module_sections(content)

    score = 0
    matched_sections = []

    for kw in keywords:
        if kw in title_words:
            score += 5
        if kw in content_word_counts:
            score += content_word_counts[kw] * 2

    for sec in sections:
        sec_words = set(re.findall(r"\w+", sec.lower()))
        if any(kw in sec_words for kw in keywords):
            matched_sections.append(sec)

    return score, matched_sections


def find_relevant_modules(question: str, modules: list[Any]) -> list[Any]:
    """
    Code-driven term overlap & keyword relevance scoring to identify
    the most relevant training module for an employee's query.
    No vector database required.
    """
    if not modules:
        return []

    words = re.findall(r"\w+", question.lower())
    keywords = [w for w in words if len(w) > 2 and w not in STOP_WORDS]

    if not keywords:
        return modules

    scored_modules = []
    for mod in modules:
        score, _ = score_module_relevance(question, mod)
        scored_modules.append((score, mod))

    scored_modules.sort(key=lambda item: item[0], reverse=True)
    return [mod for score, mod in scored_modules]


def generate_followup_suggestions(module_title: str, matched_sections: list[str]) -> list[str]:
    """Generate 2-3 dynamic, contextual follow-up prompt suggestions."""
    title_lower = module_title.lower()

    if "document" in title_lower:
        return [
            "What is the minimum character length for certificate numbers?",
            "What are common data entry errors to avoid during verification?",
            "How should citizen PII and certificates be stored securely?",
        ]
    elif "portal" in title_lower:
        return [
            "What is the SLA turnaround deadline before supervisor escalation?",
            "What are the sequential steps for processing inbound portal requests?",
            "How do I update portal status flags appropriately?",
        ]
    elif "cybersecurity" in title_lower or "privacy" in title_lower:
        return [
            "What should I do if I receive a suspicious phishing email?",
            "How should citizen Aadhaar and bank details be encrypted?",
            "What are standard workstation password hygiene rules?",
        ]
    elif "record" in title_lower:
        return [
            "How long must Income Certificates be retained before archive purging?",
            "Which government records are scheduled for permanent retention?",
            "Why are immutable audit trails required for record management?",
        ]
    return [
        f"What are the primary verification rules for {module_title}?",
        f"What mistakes should be avoided in {module_title}?",
        f"Give me step-by-step procedures for {module_title}.",
    ]


async def generate_tutor_answer(
    module_title: str,
    module_content: str,
    question: str,
    mode: str = "standard",
    is_out_of_scope: bool = False,
) -> tuple[str, str]:
    """
    Generates a strictly grounded Copilot response.
    Returns: (answer_text, grounding_status)
    grounding_status: 'grounded' | 'insufficient_context' | 'fallback'
    """
    if is_out_of_scope:
        refusal_msg = (
            f"This topic cannot be verified from the approved training module ('{module_title}').\n\n"
            "As an official Government Training Copilot, I am strictly restricted from inventing unverified "
            "administrative policies, statutory deadlines, or legal requirements. Please refer to your "
            "departmental Standard Operating Procedures (SOP) or consult your administrative supervisor."
        )
        return refusal_msg, "insufficient_context"

    mode_instructions = {
        "standard": "Provide professional, structured step-by-step guidance with clear bullet points.",
        "simple": "Explain the concept in simple, accessible language suitable for new employees.",
        "procedure": "Provide an exact, numbered sequential workflow procedure (Step 1, Step 2, Step 3...).",
        "pitfalls": "Highlight critical red flags, common mistakes, and errors the officer must avoid.",
        "example": "Provide a realistic workplace administrative scenario illustrating this concept in action.",
        "test_understanding": "Provide a quick check-for-understanding scenario followed by the correct answer explanation.",
    }.get(mode, "Provide professional, structured step-by-step guidance with clear bullet points.")


    prompt = f"""You are an official Government Training Copilot assisting a local government office employee.
You must strictly ground your response in the official training curriculum provided below.

CRITICAL ANTI-HALLUCINATION RULES:
1. Answer ONLY based on the official training content provided.
2. NEVER invent, extrapolate, or fabricate government rules, legal requirements, deadlines, statutory policies, or procedures not explicitly stated in the training module.
3. If a specific detail or policy is not present in the provided text, explicitly state: "This specific procedure or policy is not covered in the approved training module."
4. Explicitly cite the module title '{module_title}' in your explanation.
5. Modality Instruction: {mode_instructions}

TRAINING MODULE TITLE: {module_title}
TRAINING MODULE CONTENT:
{module_content}

EMPLOYEE QUESTION:
{question}

Provide a helpful, direct, and professional answer strictly grounded in the training module content above.
"""

    if settings.GEMINI_API_KEY:
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            if response and response.text:
                return response.text.strip(), "grounded"
        except Exception:
            pass

    # Deterministic verified fallback answer when Gemini is unavailable
    fallback_text = get_deterministic_tutor_fallback(module_title, question, mode)
    return fallback_text, "fallback"


def get_deterministic_tutor_fallback(module_title: str, question: str, mode: str) -> str:
    """Deterministic, verified fallback responses based on module curriculum."""
    q_lower = question.lower()
    t_lower = module_title.lower()

    if (
        "cybersecurity" in t_lower
        or "phishing" in q_lower
        or "password" in q_lower
        or "mfa" in q_lower
    ):
        if mode == "procedure":
            return (
                f"Based on '{module_title}':\n"
                "1. Maintain strong password hygiene and enable Multi-Factor Authentication (MFA).\n"
                "2. Lock your computer screen immediately whenever leaving your workstation.\n"
                "3. Verify sender domains on all external emails before entering credentials.\n"
                "4. Encrypt all citizen PII at rest and in transit."
            )
        elif mode == "pitfalls":
            return (
                f"Based on '{module_title}': Red Flags & Mistakes to Avoid:\n"
                "- Clicking unverified links in external emails.\n"
                "- Leaving unlocked administrative workstations unattended.\n"
                "- Storing unencrypted spreadsheets with citizen Aadhaar/bank numbers on personal drives."
            )
        elif mode == "example":
            return (
                f"Based on '{module_title}': Workplace Scenario:\n"
                "An officer receives an urgent email marked 'Immediate Notice from District Collector' requesting password verification via an external link. "
                "Correct procedure: Do NOT click the link. Verify the official sender domain (.gov.in) and report the phishing attempt immediately to the departmental IT coordinator."
            )
        elif mode == "test_understanding":
            return (
                f"Based on '{module_title}': Understanding Check:\n"
                "Q: An employee needs to step away for a 5-minute tea break. What is the mandatory security action?\n"
                "A: Lock the workstation screen (Windows Key + L) immediately to prevent unauthorized access to citizen records."
            )
        elif mode == "simple":
            return f"Based on '{module_title}': Keep government computers safe by locking your screen, using strong passwords, and never opening suspicious email links."
        return f"Based on '{module_title}': Protect government networks and credentials by maintaining password hygiene, using MFA, locking screens when away, and avoiding unverified email attachments."

    elif "portal" in t_lower or "sla" in q_lower or "escalat" in q_lower or "workflow" in q_lower:
        if mode == "procedure":
            return (
                f"Based on '{module_title}':\n"
                "1. Review inbound citizen applications against supporting documents.\n"
                "2. Route applications to designated departmental supervisors for secondary sign-off.\n"
                "3. Update portal status flags ('Under Review', 'Approved', 'Rejected') promptly.\n"
                "4. Ensure resolution within 7 business days to prevent automatic supervisor escalation."
            )
        elif mode == "pitfalls":
            return (
                f"Based on '{module_title}': Common Mistakes to Avoid:\n"
                "- Allowing files to exceed 7 business days without supervisor escalation notice.\n"
                "- Failing to update portal status flags when routing applications.\n"
                "- Marking applications approved without supervisor sign-off."
            )
        elif mode == "example":
            return (
                f"Based on '{module_title}': Workplace Scenario:\n"
                "A citizen applies for an emergency residential certificate. Day 5 arrives without secondary approval. "
                "Correct procedure: Flag the pending file in the portal and notify the designated departmental supervisor before Day 7 SLA breach triggers automatic administrative escalation."
            )
        elif mode == "test_understanding":
            return (
                f"Based on '{module_title}': Understanding Check:\n"
                "Q: What is the maximum SLA window for processing standard portal requests before automatic supervisor escalation?\n"
                "A: 7 business days."
            )
        elif mode == "simple":
            return f"Based on '{module_title}': Process citizen applications step-by-step and finish within 7 business days so tickets do not get escalated to supervisors."
        return f"Based on '{module_title}': Review inbound applications against supporting documents, route for supervisor sign-off, and resolve within 7 business days to prevent automatic SLA escalation."

    elif (
        "record" in t_lower or "retention" in q_lower or "archive" in q_lower or "audit" in q_lower
    ):
        if mode == "procedure":
            return (
                f"Based on '{module_title}':\n"
                "1. Apply standardized metadata tags (Year, Category, Issuing Office, Record ID) during ingest.\n"
                "2. Retain permanent records (financial and land titles) indefinitely.\n"
                "3. Retain Income Certificates for 5 years before scheduled archive purging.\n"
                "4. Maintain immutable system audit logs for all document updates, exports, and access requests."
            )
        elif mode == "pitfalls":
            return (
                f"Based on '{module_title}': Critical Record Management Pitfalls:\n"
                "- Deleting permanent land or financial records.\n"
                "- Archiving files without standardized metadata tags.\n"
                "- Disabling or bypassing system audit logging."
            )
        elif mode == "example":
            return (
                f"Based on '{module_title}': Workplace Scenario:\n"
                "During a routine annual audit, an administrative clerk asks whether 6-year-old Income Certificate files can be permanently destroyed. "
                "Correct procedure: Verify that the 5-year statutory retention policy has expired, obtain supervisor sign-off, and record the purge in the immutable system audit trail."
            )
        elif mode == "test_understanding":
            return (
                f"Based on '{module_title}': Understanding Check:\n"
                "Q: How long must routine Income Certificate records be retained before scheduled archive purging?\n"
                "A: 5 years."
            )
        elif mode == "simple":
            return f"Based on '{module_title}': Tag every file with year and office name. Keep land records forever, and keep income certificates for 5 years."
        return f"Based on '{module_title}': Official records require metadata tags for indexing. Land/financial records are kept permanently; income certificates are retained 5 years before archive purging."

    else:
        # Default: Digital Document Handling
        if mode == "procedure":
            return (
                f"Based on '{module_title}':\n"
                "1. Verify that Full Name, Certificate Number, Issue Date, and Expiry Date are legible.\n"
                "2. Confirm the certificate number is alphanumeric and at least 6 characters.\n"
                "3. Check that the expiry date is not prior to the current date.\n"
                "4. Verify issuing authority stamps and official digital signatures."
            )
        elif mode == "pitfalls":
            return (
                f"Based on '{module_title}': Common Verification Mistakes:\n"
                "- Name Mismatches: Typos between applications and uploaded certificates.\n"
                "- Expired Documents: Accepting certificates past their validity period.\n"
                "- Blurry Scans: Approving low-resolution scans with unreadable stamps."
            )
        elif mode == "example":
            return (
                f"Based on '{module_title}': Workplace Scenario:\n"
                "An applicant submits an Income Certificate where the certificate number is 'INC-12' (5 characters) and valid upto 2022. "
                "Correct procedure: Reject the document pre-check. Certificate numbers must be at least 6 characters and valid (not expired)."
            )
        elif mode == "test_understanding":
            return (
                f"Based on '{module_title}': Understanding Check:\n"
                "Q: What is the minimum required alphanumeric character length for a valid certificate number?\n"
                "A: 6 characters."
            )
        elif mode == "simple":
            return f"Based on '{module_title}': Check that citizen names match, certificate numbers have at least 6 characters, and documents are not expired."
        return f"Based on '{module_title}': When reviewing citizen documents, verify that Full Name, Certificate Number (alphanumeric, min 6 chars), and Expiry Date are clearly readable."



async def generate_rule_explanation(
    failed_rule_name: str,
    context: dict | str | None = None,
    field_name: str = "",
    field_value: str | None = None,
) -> str:
    """
    AI Explanation Layer: Only ever explains a failed result that the Rule Engine
    has ALREADY produced. Never makes pass/fail decisions.
    Strictly receives only the minimal required context to preserve citizen privacy.
    """
    reason_str = ""
    if isinstance(context, dict):
        reason_str = f"Extracted Field: {field_name or 'Document field'}"
    elif isinstance(context, str):
        reason_str = context

    prompt = f"""You are a helpful citizen-support AI assistant for a local government portal.
A deterministic compliance rule engine evaluated an uploaded Income Certificate and found that the following check failed:

FAILED RULE: {failed_rule_name}
FAILURE DETAIL: {reason_str or "Field check failed validation criteria."}

Write a short, polite, 1-2 sentence plain-language explanation to the citizen explaining why this rule failed and what simple corrective action they should take before formal submission.
Do NOT decide whether the document passes or fails—simply explain the rule failure clearly.
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
        return "The certificate number appears invalid or missing. Ensure your certificate displays a valid alphanumeric number with at least 6 characters (e.g., INC123456)."
    elif failed_rule_name == "Certificate not expired":
        return "The validity period for this certificate has expired. Please obtain a recently issued or renewed Income Certificate before applying."
    elif failed_rule_name == "All required fields extracted":
        return "Some mandatory fields (Name, Certificate Number, or Expiry Date) could not be read. Please upload a clearer scan of your document."
    else:
        return f"Validation check '{failed_rule_name}' failed. Please review your document details and upload a clean, unblurred copy."
