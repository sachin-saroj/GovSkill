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
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border-warm shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-warm/70 pb-5">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-[0.2em]">
              <FileSpreadsheet className="h-4 w-4 text-civic" />
              <span>Statutory Compliance & Audit</span>
            </div>
            <h3 className="font-sans font-bold text-xl uppercase tracking-tight text-ink">
              Workforce Certification & Compliance Audit
            </h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Generate structured audit trails of all enrolled officers, completion status, evaluation scores, and cryptographic credential verification IDs.
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => onExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-light hover:bg-surface-elevated disabled:opacity-50 text-ink text-xs font-mono font-bold uppercase tracking-wider rounded-full border border-border-warm shadow-xs transition-all cursor-pointer min-h-[40px]"
              title="Export Workforce Compliance Report as CSV"
            >
              {isExporting === 'csv' ? (
                <Loader2 className="h-4 w-4 animate-spin text-ink" />
              ) : (
                <Download className="h-4 w-4 text-civic" />
              )}
              <span>Export Audit (CSV)</span>
            </button>

            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => onExport('json')}
              className="flex items-center gap-2 px-4 py-2 bg-surface-light hover:bg-surface-elevated disabled:opacity-50 text-ink text-xs font-mono font-bold uppercase tracking-wider rounded-full border border-border-warm shadow-xs transition-all cursor-pointer min-h-[40px]"
              title="Export Full Compliance Audit Trail as JSON"
            >
              {isExporting === 'json' ? (
                <Loader2 className="h-4 w-4 animate-spin text-ink" />
              ) : (
                <FileJson className="h-4 w-4 text-civic" />
              )}
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Compliance Error Alert */}
        {complianceError && (
          <div className="p-4 bg-surface-light border-l-4 border-l-rose border-border-warm rounded-r-xl flex items-center gap-2.5 text-xs text-rose">
            <AlertCircle className="h-4 w-4 text-rose shrink-0" />
            <span className="font-bold">{complianceError}</span>
          </div>
        )}

        {/* Compliance Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-5 bg-surface-light rounded-xl border border-border-warm space-y-1 shadow-xs">
            <span className="text-ink-muted font-mono font-bold uppercase text-[10px] flex items-center gap-1 tracking-wider">
              <Users className="h-3 w-3 text-ink-muted" /> Workforce Size
            </span>
            <p className="font-mono text-2xl font-bold text-ink">{totalEmployees} Officers</p>
            <span className="text-xs text-ink-muted font-sans">Enrolled in active training</span>
          </div>

          <div className="p-5 bg-surface-light rounded-xl border border-border-warm space-y-1 shadow-xs">
            <span className="text-sage font-mono font-bold uppercase text-[10px] flex items-center gap-1 tracking-wider">
              <Award className="h-3 w-3 text-sage" /> Verified Credentials
            </span>
            <p className="font-mono text-2xl font-bold text-sage">{totalCertifications} Certificates</p>
            <span className="text-xs text-sage/80 font-sans">≥ 75% evaluation threshold</span>
          </div>

          <div className="p-5 bg-surface-light rounded-xl border border-border-warm space-y-1 shadow-xs">
            <span className="text-ink-muted font-mono font-bold uppercase text-[10px] flex items-center gap-1 tracking-wider">
              <ShieldCheck className="h-3 w-3 text-civic" /> Overall Compliance
            </span>
            <p className="font-mono text-2xl font-bold text-ink">{overallComplianceRate}%</p>
            <span className="text-xs text-ink-muted font-sans">Workforce certification coverage</span>
          </div>

          <div className="p-5 bg-surface-light rounded-xl border border-border-warm space-y-1 shadow-xs">
            <span className="text-rose font-mono font-bold uppercase text-[10px] flex items-center gap-1 tracking-wider">
              <AlertTriangle className="h-3 w-3 text-rose" /> Attention Required
            </span>
            <p className="font-mono text-2xl font-bold text-rose">{uncertifiedRecords} Modules</p>
            <span className="text-xs text-rose/80 font-sans">Pending certification / review</span>
          </div>
        </div>

        {/* Live Compliance Records Preview */}
        {isLoadingCompliance ? (
          <div className="flex items-center justify-center py-8 gap-2 text-ink-muted text-xs font-mono">
            <Loader2 className="h-4 w-4 animate-spin text-ink" />
            <span>Loading compliance records...</span>
          </div>
        ) : complianceReport && complianceReport.records.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-border-warm/70">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-ink">
                Workforce Module Certification Ledger ({complianceReport.records.length} Records)
              </h4>
              <span className="text-xs text-ink-muted font-mono">
                Last Generated: {new Date(complianceReport.generated_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border-warm shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-light/60 border-b border-border-warm/70 text-ink-muted font-mono font-bold text-[10px] uppercase tracking-[0.12em]">
                  <tr>
                    <th className="px-4 py-3 border-r border-border-warm/50">Officer Email</th>
                    <th className="px-4 py-3 border-r border-border-warm/50">Module</th>
                    <th className="px-4 py-3 text-center border-r border-border-warm/50">Score</th>
                    <th className="px-4 py-3 text-center border-r border-border-warm/50">Status</th>
                    <th className="px-4 py-3">Credential Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm/50 font-normal">
                  {complianceReport.records.slice(0, 10).map((r, idx) => (
                    <tr key={`${r.employee_email}-${r.module_title}-${idx}`} className="hover:bg-surface-light/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-ink border-r border-border-warm/50">
                        {r.employee_email}
                      </td>
                      <td className="px-4 py-3 text-ink font-sans border-r border-border-warm/50">
                        {r.module_title}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-ink border-r border-border-warm/50">
                        {r.percentage}% ({r.best_score}/{r.total_score})
                      </td>
                      <td className="px-4 py-3 text-center border-r border-border-warm/50">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                            r.certified
                              ? 'bg-sage/15 text-sage border-sage/30'
                              : r.progress_status === 'in_progress'
                              ? 'bg-civic/15 text-civic border-civic/30'
                              : 'bg-surface-light text-ink-muted border-border-warm'
                          }`}
                        >
                          {r.certified ? 'CERTIFIED' : r.progress_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {r.credential_id ? (
                          <Link
                            to={`/verify/${r.credential_id}`}
                            className="inline-flex items-center gap-1 text-ink underline hover:text-civic font-bold"
                            title="Verify cryptographic credential"
                          >
                            <span>{r.credential_id}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-ink-muted italic font-normal">Not Certified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {complianceReport.records.length > 10 && (
              <p className="text-xs text-ink-muted italic text-center pt-1 font-sans">
                Showing top 10 records. Use the "Export Audit (CSV)" button above to download the full {complianceReport.records.length}-record audit trail.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-ink-muted bg-surface-light rounded-xl border border-border-warm font-sans">
            No compliance records found.
          </div>
        )}
      </div>

      {/* SECTION 2: GOVASSIST CITIZEN PRE-SUBMISSION DEFECT TELEMETRY */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border-warm shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-warm/70 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-rose uppercase tracking-[0.2em]">
              <Activity className="h-4 w-4" />
              <span>Citizen Self-Service Quality Intelligence</span>
            </div>
            <h3 className="font-sans font-bold text-xl uppercase tracking-tight text-ink">
              GovAssist Pre-Check Defect Telemetry
            </h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Real-time analytics on citizen document quality and defect patterns across the 4 deterministic pre-submission rules.
            </p>
          </div>

          {citizenTelemetry && (
            <div className="flex items-center gap-2 bg-sage/15 px-3 py-1.5 rounded-full border border-sage/30 text-xs font-mono font-bold text-sage shrink-0 uppercase">
              <CheckCircle2 className="h-4 w-4 text-sage" />
              <span>{citizenTelemetry.pass_rate_pct}% First-Pass Rate</span>
            </div>
          )}
        </div>

        {/* Telemetry Error Alert */}
        {telemetryError && (
          <div className="p-4 bg-surface-light border-l-4 border-l-rose border-border-warm rounded-r-xl flex items-center gap-2.5 text-xs text-rose">
            <AlertCircle className="h-4 w-4 text-rose shrink-0" />
            <span className="font-bold">{telemetryError}</span>
          </div>
        )}

        {isLoadingTelemetry ? (
          <div className="flex items-center justify-center py-10 gap-2 text-ink-muted text-xs font-mono">
            <Loader2 className="h-5 w-5 animate-spin text-ink" />
            <span>Loading citizen defect telemetry...</span>
          </div>
        ) : citizenTelemetry && citizenTelemetry.total_submissions > 0 ? (
          <div className="space-y-6">
            {/* Metrics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-surface-light rounded-xl border border-border-warm space-y-1 shadow-xs">
                <span className="text-ink-muted font-mono font-bold uppercase text-[10px] tracking-wider">Total Pre-Checks</span>
                <p className="font-mono text-2xl font-bold text-ink">{citizenTelemetry.total_submissions}</p>
                <span className="text-xs text-ink-muted font-sans">Documents evaluated</span>
              </div>

              <div className="p-5 bg-surface-light rounded-xl border border-border-warm space-y-1 shadow-xs">
                <span className="text-sage font-mono font-bold uppercase text-[10px] tracking-wider">Passed Ready for Filing</span>
                <p className="font-mono text-2xl font-bold text-sage">{citizenTelemetry.passed_count}</p>
                <span className="text-xs text-sage/80 font-sans">100% compliant submissions</span>
              </div>

              <div className="p-5 bg-surface-light rounded-xl border border-border-warm space-y-1 shadow-xs">
                <span className="text-rose font-mono font-bold uppercase text-[10px] tracking-wider">Action Required / Rectified</span>
                <p className="font-mono text-2xl font-bold text-rose">{citizenTelemetry.action_required_count}</p>
                <span className="text-xs text-rose/80 font-sans">Defects caught pre-filing</span>
              </div>
            </div>

            {/* 4-Rule Defect Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-border-warm/70">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-ink">
                  Deterministic Rule Failure Distribution
                </h4>
                <span className="text-xs font-mono text-ink-muted">4 Core Validation Rules</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {citizenTelemetry.defects_by_rule.map((rule) => (
                  <div
                    key={rule.rule_name}
                    className="p-5 border border-border-warm bg-surface-light rounded-xl space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-ink uppercase">{rule.rule_name}</span>
                      <span className={`font-mono font-bold ${rule.failure_count > 0 ? 'text-rose' : 'text-sage'}`}>
                        {rule.failure_count} failures ({rule.failure_rate_pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-border-warm rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          rule.failure_count === 0 ? 'bg-sage' : 'bg-rose'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(rule.failure_rate_pct, rule.failure_count > 0 ? 8 : 0))}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <span>Target Field: <code className="font-mono text-ink font-bold">{rule.field}</code></span>
                      <span className="font-mono font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 bg-surface-elevated text-ink-muted border border-border-warm rounded-full">
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
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-ink">
                  Recent Pre-Submission Inspections
                </h4>

                <div className="overflow-x-auto rounded-xl border border-border-warm shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface-light/60 border-b border-border-warm/70 text-ink-muted font-mono font-bold text-[10px] uppercase tracking-[0.12em]">
                      <tr>
                        <th className="px-4 py-3 border-r border-border-warm/50">Document Reference</th>
                        <th className="px-4 py-3 border-r border-border-warm/50">Detected Applicant</th>
                        <th className="px-4 py-3 text-center border-r border-border-warm/50">Pre-Check Status</th>
                        <th className="px-4 py-3 border-r border-border-warm/50">Identified Defects</th>
                        <th className="px-4 py-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-warm/50 font-normal">
                      {citizenTelemetry.recent_inspections.map((doc) => (
                        <tr key={doc.document_id} className="hover:bg-surface-light/80 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs border-r border-border-warm/50">
                            <Link
                              to={`/citizen?id=${doc.document_id}`}
                              className="text-ink underline hover:text-civic font-bold inline-flex items-center gap-1"
                              title="Inspect citizen document in GovAssist pre-checker"
                            >
                              <span>{doc.document_id.slice(0, 8)}...</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                          <td className="px-4 py-3 font-bold text-ink border-r border-border-warm/50">
                            {doc.extracted_name || <span className="text-ink-muted italic font-normal">Unidentified Scan</span>}
                          </td>
                          <td className="px-4 py-3 text-center border-r border-border-warm/50">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                                doc.overall_status === 'PASSED'
                                  ? 'bg-sage/15 text-sage border-sage/30'
                                  : 'bg-rose/15 text-rose border-rose/30'
                              }`}
                            >
                              {doc.overall_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-ink-muted border-r border-border-warm/50">
                            {doc.failed_rules.length > 0 ? (
                              <span className="text-rose font-bold font-mono">
                                {doc.failed_rules.join(', ')}
                              </span>
                            ) : (
                              <span className="text-sage font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-sage" />
                                All 4 checks compliant
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-ink-muted font-mono text-xs">
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
          <div className="text-center py-8 text-xs text-ink-muted bg-surface-light rounded-xl border border-border-warm font-sans">
            No citizen pre-submission records recorded yet.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GovernanceDashboard;
