import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileSpreadsheet,
  Download,
  FileJson,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Award,
  Users,
  AlertCircle,
} from 'lucide-react';
import {
  AdminSkillOverviewResponse,
  CitizenTelemetryResponse,
  ComplianceReportResponse,
} from '@/types';
import { fadeUpVariants } from '@/lib/motion';

interface GovernanceDashboardProps {
  skillsOverview: AdminSkillOverviewResponse | null;
  complianceReport: ComplianceReportResponse | null;
  citizenTelemetry: CitizenTelemetryResponse | null;
  isLoadingCompliance: boolean;
  isLoadingTelemetry: boolean;
  complianceError: string | null;
  telemetryError: string | null;
  isExporting: 'csv' | 'json' | null;
  onExport: (format: 'csv' | 'json') => void;
}

export const GovernanceDashboard: React.FC<GovernanceDashboardProps> = ({
  skillsOverview,
  complianceReport,
  citizenTelemetry,
  isLoadingCompliance,
  isLoadingTelemetry,
  complianceError,
  telemetryError,
  isExporting,
  onExport,
}) => {
  const totalEmployees = skillsOverview?.total_employees ?? 0;
  const totalCertifications = skillsOverview?.total_certifications ?? 0;
  const overallComplianceRate = skillsOverview?.overall_certification_rate ?? 0;

  // Calculate developing/non-compliant records from compliance report
  const uncertifiedRecords =
    complianceReport?.records.filter((r) => !r.certified).length ?? 0;

  return (
    <motion.div variants={fadeUpVariants} className="space-y-8">
      {/* SECTION 1: WORKFORCE COMPLIANCE & CREDENTIAL AUDIT */}
      <div className="bg-[#EDE4D0] rounded-2xl p-6 sm:p-8 border border-[#D9CFBB] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9CFBB] pb-5">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-[#6B6357] uppercase tracking-widest">
              <FileSpreadsheet className="h-4 w-4 text-[#2A5B4A]" />
              <span>Statutory Compliance & Audit</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-[#0A0A0A] tracking-tight">
              Workforce Certification & Compliance Audit
            </h3>
            <p className="text-xs text-[#6B6357] font-sans font-normal">
              Generate structured audit trails of all enrolled officers, completion status, evaluation scores, and cryptographic credential verification IDs.
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => onExport('csv')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F5EFE0] hover:bg-[#F5EFE0]/80 disabled:opacity-50 text-[#0A0A0A] text-xs font-mono font-semibold rounded-full border border-[#D9CFBB] shadow-xs transition-all cursor-pointer min-h-[40px]"
              title="Export Workforce Compliance Report as CSV"
            >
              {isExporting === 'csv' ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#0A0A0A]" />
              ) : (
                <Download className="h-4 w-4 text-[#2A5B4A]" />
              )}
              <span>Export Audit (CSV)</span>
            </button>

            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => onExport('json')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F5EFE0] hover:bg-[#F5EFE0]/80 disabled:opacity-50 text-[#0A0A0A] text-xs font-mono font-semibold rounded-full border border-[#D9CFBB] shadow-xs transition-all cursor-pointer min-h-[40px]"
              title="Export Full Compliance Audit Trail as JSON"
            >
              {isExporting === 'json' ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#0A0A0A]" />
              ) : (
                <FileJson className="h-4 w-4 text-[#2A5B4A]" />
              )}
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Compliance Error Alert */}
        {complianceError && (
          <div className="p-4 rounded-xl bg-[#F5EFE0] border border-[#C97B5A]/40 flex items-center gap-2.5 text-xs text-[#C97B5A]">
            <AlertCircle className="h-4 w-4 text-[#C97B5A] shrink-0" />
            <span className="font-semibold">{complianceError}</span>
          </div>
        )}

        {/* Compliance Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-1 shadow-xs">
            <span className="text-[#6B6357] font-mono font-semibold uppercase text-[10px] flex items-center gap-1">
              <Users className="h-3 w-3 text-[#6B6357]" /> Workforce Size
            </span>
            <p className="font-mono text-2xl font-bold text-[#0A0A0A]">{totalEmployees} Officers</p>
            <span className="text-xs text-[#6B6357] font-sans font-normal">Enrolled in active training</span>
          </div>

          <div className="p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-1 shadow-xs">
            <span className="text-[#2A5B4A] font-mono font-semibold uppercase text-[10px] flex items-center gap-1">
              <Award className="h-3 w-3 text-[#2A5B4A]" /> Verified Credentials
            </span>
            <p className="font-mono text-2xl font-bold text-[#2A5B4A]">{totalCertifications} Certificates</p>
            <span className="text-xs text-[#2A5B4A] font-sans font-normal">≥ 75% evaluation threshold</span>
          </div>

          <div className="p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-1 shadow-xs">
            <span className="text-[#6B6357] font-mono font-semibold uppercase text-[10px] flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#2A5B4A]" /> Overall Compliance
            </span>
            <p className="font-mono text-2xl font-bold text-[#0A0A0A]">{overallComplianceRate}%</p>
            <span className="text-xs text-[#6B6357] font-sans font-normal">Workforce certification coverage</span>
          </div>

          <div className="p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-1 shadow-xs">
            <span className="text-[#C97B5A] font-mono font-semibold uppercase text-[10px] flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-[#C97B5A]" /> Attention Required
            </span>
            <p className="font-mono text-2xl font-bold text-[#C97B5A]">{uncertifiedRecords} Modules</p>
            <span className="text-xs text-[#C97B5A] font-sans font-normal">Pending certification / review</span>
          </div>
        </div>

        {/* Live Compliance Records Preview */}
        {isLoadingCompliance ? (
          <div className="flex items-center justify-center py-8 gap-2 text-[#6B6357] text-xs font-mono">
            <Loader2 className="h-4 w-4 animate-spin text-[#0A0A0A]" />
            <span>Loading compliance records...</span>
          </div>
        ) : complianceReport && complianceReport.records.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6B6357]">
                Workforce Module Certification Ledger ({complianceReport.records.length} Records)
              </h4>
              <span className="text-xs text-[#6B6357] font-mono font-normal">
                Last Generated: {new Date(complianceReport.generated_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#D9CFBB] shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFE0] border-b border-[#D9CFBB] text-[#6B6357] font-mono font-semibold text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Officer Email</th>
                    <th className="px-4 py-3">Module</th>
                    <th className="px-4 py-3 text-center">Score</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Credential Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9CFBB]/60 font-normal">
                  {complianceReport.records.slice(0, 10).map((r, idx) => (
                    <tr key={`${r.employee_email}-${r.module_title}-${idx}`} className="hover:bg-[#F5EFE0]/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0A0A0A]">
                        {r.employee_email}
                      </td>
                      <td className="px-4 py-3 text-[#0A0A0A] font-sans">
                        {r.module_title}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-[#0A0A0A]">
                        {r.percentage}% ({r.best_score}/{r.total_score})
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                            r.certified
                              ? 'bg-[#EDE4D0] text-[#2A5B4A] border-[#2A5B4A]/40'
                              : r.progress_status === 'in_progress'
                              ? 'bg-[#EDE4D0] text-[#C9A24A] border-[#C9A24A]/40'
                              : 'bg-[#EDE4D0] text-[#6B6357] border-[#D9CFBB]'
                          }`}
                        >
                          {r.certified ? 'CERTIFIED' : r.progress_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {r.credential_id ? (
                          <Link
                            to={`/verify/${r.credential_id}`}
                            className="inline-flex items-center gap-1 text-[#0A0A0A] underline hover:text-[#2A5B4A] font-semibold"
                            title="Verify cryptographic credential"
                          >
                            <span>{r.credential_id}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-[#6B6357] italic font-normal">Not Certified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {complianceReport.records.length > 10 && (
              <p className="text-xs text-[#6B6357] italic text-center pt-1 font-sans">
                Showing top 10 records. Use the "Export Audit (CSV)" button above to download the full {complianceReport.records.length}-record audit trail.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#6B6357] bg-[#F5EFE0] rounded-xl border border-[#D9CFBB] font-sans">
            No compliance records found.
          </div>
        )}
      </div>

      {/* SECTION 2: GOVASSIST CITIZEN PRE-SUBMISSION DEFECT TELEMETRY */}
      <div className="bg-[#EDE4D0] rounded-2xl p-6 sm:p-8 border border-[#D9CFBB] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9CFBB] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-[#2A5B4A] uppercase tracking-widest">
              <Activity className="h-4 w-4" />
              <span>Citizen Self-Service Quality Intelligence</span>
            </div>
            <h3 className="font-serif text-xl font-normal text-[#0A0A0A] tracking-tight">
              GovAssist Pre-Check Defect Telemetry
            </h3>
            <p className="text-xs text-[#6B6357] font-sans font-normal">
              Real-time analytics on citizen document quality and defect patterns across the 4 deterministic pre-submission rules.
            </p>
          </div>

          {citizenTelemetry && (
            <div className="flex items-center gap-2 bg-[#F5EFE0] px-3.5 py-1.5 rounded-full border border-[#2A5B4A]/40 text-xs font-mono font-semibold text-[#2A5B4A] shrink-0">
              <CheckCircle2 className="h-4 w-4 text-[#2A5B4A]" />
              <span>{citizenTelemetry.pass_rate_pct}% First-Pass Rate</span>
            </div>
          )}
        </div>

        {/* Telemetry Error Alert */}
        {telemetryError && (
          <div className="p-4 rounded-xl bg-[#F5EFE0] border border-[#C97B5A]/40 flex items-center gap-2.5 text-xs text-[#C97B5A]">
            <AlertCircle className="h-4 w-4 text-[#C97B5A] shrink-0" />
            <span className="font-semibold">{telemetryError}</span>
          </div>
        )}

        {isLoadingTelemetry ? (
          <div className="flex items-center justify-center py-10 gap-2 text-[#6B6357] text-xs font-mono">
            <Loader2 className="h-5 w-5 animate-spin text-[#0A0A0A]" />
            <span>Loading citizen defect telemetry...</span>
          </div>
        ) : citizenTelemetry && citizenTelemetry.total_submissions > 0 ? (
          <div className="space-y-6">
            {/* Metrics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-1 shadow-xs">
                <span className="text-[#6B6357] font-mono font-semibold uppercase text-[10px]">Total Pre-Checks</span>
                <p className="font-mono text-2xl font-bold text-[#0A0A0A]">{citizenTelemetry.total_submissions}</p>
                <span className="text-xs text-[#6B6357] font-sans font-normal">Documents evaluated</span>
              </div>

              <div className="p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-1 shadow-xs">
                <span className="text-[#2A5B4A] font-mono font-semibold uppercase text-[10px]">Passed Ready for Filing</span>
                <p className="font-mono text-2xl font-bold text-[#2A5B4A]">{citizenTelemetry.passed_count}</p>
                <span className="text-xs text-[#2A5B4A] font-sans font-normal">100% compliant submissions</span>
              </div>

              <div className="p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-1 shadow-xs">
                <span className="text-[#C97B5A] font-mono font-semibold uppercase text-[10px]">Action Required / Rectified</span>
                <p className="font-mono text-2xl font-bold text-[#C97B5A]">{citizenTelemetry.action_required_count}</p>
                <span className="text-xs text-[#C97B5A] font-sans font-normal">Defects caught pre-filing</span>
              </div>
            </div>

            {/* 4-Rule Defect Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6B6357]">
                  Deterministic Rule Failure Distribution
                </h4>
                <span className="text-xs font-mono text-[#6B6357]">4 Core Validation Rules</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {citizenTelemetry.defects_by_rule.map((rule) => (
                  <div
                    key={rule.rule_name}
                    className="p-5 rounded-xl border border-[#D9CFBB] bg-[#F5EFE0] space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-semibold text-[#0A0A0A]">{rule.rule_name}</span>
                      <span className={`font-mono font-bold ${rule.failure_count > 0 ? 'text-[#C97B5A]' : 'text-[#2A5B4A]'}`}>
                        {rule.failure_count} failures ({rule.failure_rate_pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[#EDE4D0] rounded-full overflow-hidden border border-[#D9CFBB]">
                      <div
                        className={`h-full rounded-full transition-all ${
                          rule.failure_count === 0 ? 'bg-[#2A5B4A]' : 'bg-[#C97B5A]'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(rule.failure_rate_pct, rule.failure_count > 0 ? 8 : 0))}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6B6357] font-normal">
                      <span>Target Field: <code className="font-mono text-[#0A0A0A] font-semibold">{rule.field}</code></span>
                      <span className="font-mono font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-full bg-[#EDE4D0] text-[#6B6357] border border-[#D9CFBB]">
                        {rule.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Pre-Check Inspection Logs */}
            {citizenTelemetry.recent_inspections && citizenTelemetry.recent_inspections.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6B6357]">
                  Recent Pre-Submission Inspections
                </h4>

                <div className="overflow-x-auto rounded-xl border border-[#D9CFBB] shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5EFE0] border-b border-[#D9CFBB] text-[#6B6357] font-mono font-semibold text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Document Reference</th>
                        <th className="px-4 py-3">Detected Applicant</th>
                        <th className="px-4 py-3 text-center">Pre-Check Status</th>
                        <th className="px-4 py-3">Identified Defects</th>
                        <th className="px-4 py-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9CFBB]/60 font-normal">
                      {citizenTelemetry.recent_inspections.map((doc) => (
                        <tr key={doc.document_id} className="hover:bg-[#F5EFE0]/60 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs">
                            <Link
                              to={`/citizen?id=${doc.document_id}`}
                              className="text-[#0A0A0A] underline hover:text-[#2A5B4A] font-semibold inline-flex items-center gap-1"
                              title="Inspect citizen document in GovAssist pre-checker"
                            >
                              <span>{doc.document_id.slice(0, 8)}...</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0A0A0A]">
                            {doc.extracted_name || <span className="text-[#6B6357] italic font-normal">Unidentified Scan</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                                doc.overall_status === 'PASSED'
                                  ? 'bg-[#EDE4D0] text-[#2A5B4A] border-[#2A5B4A]/40'
                                  : 'bg-[#EDE4D0] text-[#C97B5A] border-[#C97B5A]/40'
                              }`}
                            >
                              {doc.overall_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#6B6357]">
                            {doc.failed_rules.length > 0 ? (
                              <span className="text-[#C97B5A] font-semibold font-mono">
                                {doc.failed_rules.join(', ')}
                              </span>
                            ) : (
                              <span className="text-[#2A5B4A] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-[#2A5B4A]" />
                                All 4 checks compliant
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-[#6B6357] font-mono text-xs">
                            {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#6B6357] bg-[#F5EFE0] rounded-xl border border-[#D9CFBB] font-sans">
            No citizen pre-submission records recorded yet.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GovernanceDashboard;
