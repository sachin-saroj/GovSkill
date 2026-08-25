from pydantic import BaseModel


class CitizenDefectRuleItem(BaseModel):
    rule_name: str
    field: str
    failure_count: int
    failure_rate_pct: float
    severity: str


class CitizenTelemetryResponse(BaseModel):
    total_submissions: int
    passed_count: int
    action_required_count: int
    pass_rate_pct: float
    defects_by_rule: list[CitizenDefectRuleItem]
    recent_inspections: list[dict]


class ComplianceReportItem(BaseModel):
    employee_email: str
    department: str
    module_title: str
    progress_status: str
    best_score: int
    total_score: int
    percentage: int
    certified: bool
    credential_id: str | None = None
    certified_date: str | None = None


class ComplianceReportResponse(BaseModel):
    generated_at: str
    total_records: int
    total_certified_count: int
    compliance_rate_pct: float
    records: list[ComplianceReportItem]
