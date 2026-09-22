import uuid

MODULE_1_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")
MODULE_2_ID = uuid.UUID("11111111-1111-1111-1111-111111111112")
MODULE_3_ID = uuid.UUID("11111111-1111-1111-1111-111111111113")
MODULE_4_ID = uuid.UUID("11111111-1111-1111-1111-111111111114")

SEED_QUESTIONS = [
    # Module 1: Digital Document Handling
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222201"),
        "module_id": MODULE_1_ID,
        "question": "What is the minimum required length for a valid Income Certificate number?",
        "options": ["4 characters", "6 characters", "8 characters", "10 characters"],
        "correct_option_index": 1,
        "competency": "Document Formatting & Standards",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222202"),
        "module_id": MODULE_1_ID,
        "question": "Which format must official certificate numbers follow?",
        "options": ["Numeric only", "Alphanumeric", "Special symbols only", "Roman numerals"],
        "correct_option_index": 1,
        "competency": "Document Formatting & Standards",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222203"),
        "module_id": MODULE_1_ID,
        "question": "What action should an employee take if a certificate's expiry date has passed?",
        "options": [
            "Approve anyway",
            "Reject or flag as expired",
            "Manually extend the date",
            "Ignore expiry date",
        ],
        "correct_option_index": 1,
        "competency": "Verification Rules & Expiry Validation",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222204"),
        "module_id": MODULE_1_ID,
        "question": "Which of the following is a mandatory field that must be present on an Income Certificate?",
        "options": [
            "Applicant Full Name",
            "Social media handle",
            "Home wifi password",
            "Blood group",
        ],
        "correct_option_index": 0,
        "competency": "Mandatory Data Integrity",
    },
    # Module 2: Government Portal Operations
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222205"),
        "module_id": MODULE_2_ID,
        "question": "After how many days without resolution is an application flagged for supervisor escalation?",
        "options": ["3 business days", "5 business days", "7 business days", "14 business days"],
        "correct_option_index": 2,
        "competency": "SLA Compliance & Escalation",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222206"),
        "module_id": MODULE_2_ID,
        "question": "What is the second step in citizen application verification workflow?",
        "options": [
            "Delete citizen files",
            "Route application for departmental supervisor sign-off",
            "Approve immediately",
            "Send SMS notification",
        ],
        "correct_option_index": 1,
        "competency": "Workflow Routing & Sign-off",
    },
    # Module 3: Cybersecurity & Data Privacy Basics
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222207"),
        "module_id": MODULE_3_ID,
        "question": "What should an employee do when receiving an email with an unverified external attachment?",
        "options": [
            "Open attachment immediately",
            "Do not click link/attachment and verify sender",
            "Forward to all colleagues",
            "Reply with portal password",
        ],
        "correct_option_index": 1,
        "competency": "Phishing Prevention & Incident Response",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222208"),
        "module_id": MODULE_3_ID,
        "question": "How must sensitive citizen records (e.g. Aadhaar / Bank details) be stored?",
        "options": [
            "Unencrypted on personal USB drives",
            "Encrypted at rest and in transit",
            "Publicly on local desktop",
            "Printed on paper only",
        ],
        "correct_option_index": 1,
        "competency": "PII Protection & Data Privacy",
    },
    # Module 4: Digital Record Management
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222209"),
        "module_id": MODULE_4_ID,
        "question": "How long must Income Certificate records be retained before scheduled archive purging?",
        "options": ["1 year", "3 years", "5 years", "10 years"],
        "correct_option_index": 2,
        "competency": "Archival Retention Policies",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222210"),
        "module_id": MODULE_4_ID,
        "question": "What tracks every document edit, export, and access request in government portals?",
        "options": [
            "Immutable system audit logs",
            "Manual paper ledger",
            "Daily browser cache",
            "Temporary email notes",
        ],
        "correct_option_index": 0,
        "competency": "System Audit Trail & Compliance",
    },
]

__all__ = [
    "MODULE_1_ID",
    "MODULE_2_ID",
    "MODULE_3_ID",
    "MODULE_4_ID",
    "SEED_QUESTIONS",
]
