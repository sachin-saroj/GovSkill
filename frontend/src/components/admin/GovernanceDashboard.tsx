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
      <div className="bg-white rounded-civic-xl p-6 sm:p-8 border border-slate-200 shadow-civic-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-micro font-semibold text-civic-700 uppercase tracking-wider">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Statutory Compliance & Audit</span>
            </div>
            <h3 className="text-section-heading font-semibold text-slate-900">
              Workforce Certification & Compliance Audit
            </h3>
            <p className="text-caption text-slate-600 font-normal">
              Generate structured audit trails of all enrolled officers, completion status, evaluation scores, and cryptographic credential verification IDs.
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => onExport('csv')}
              className="flex items-center gap-2 px-4 py-2.5 bg-civic-800 hover:bg-civic-900 disabled:opacity-50 text-white text-caption font-semibold rounded-civic-md shadow-civic-xs transition-all cursor-pointer"
              title="Export Workforce Compliance Report as CSV"
            >
              {isExporting === 'csv' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Export Audit (CSV)</span>
            </button>

            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => onExport('json')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-caption font-semibold rounded-civic-md border border-slate-300 transition-all cursor-pointer"
              title="Export Full Compliance Audit Trail as JSON"
            >
              {isExporting === 'json' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileJson className="h-4 w-4" />
              )}
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Compliance Error Alert */}
        {complianceError && (
          <div className="p-4 rounded-civic-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-caption text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{complianceError}</span>
          </div>
        )}

        {/* Compliance Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-caption">
          <div className="p-4 rounded-civic-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-micro flex items-center gap-1">
              <Users className="h-3 w-3 text-slate-400" /> Workforce Size
            </span>
            <p className="text-page-title font-semibold text-slate-900 font-mono">{totalEmployees} Officers</p>
            <span className="text-caption text-slate-400 font-normal">Enrolled in active training</span>
          </div>

          <div className="p-4 rounded-civic-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <span className="text-emerald-800 font-semibold uppercase text-micro flex items-center gap-1">
              <Award className="h-3 w-3 text-emerald-600" /> Verified Credentials
            </span>
            <p className="text-page-title font-semibold text-emerald-700 font-mono">{totalCertifications} Certificates</p>
            <span className="text-caption text-emerald-600 font-normal">≥ 75% evaluation threshold</span>
          </div>

          <div className="p-4 rounded-civic-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-micro flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-civic-700" /> Overall Compliance
            </span>
            <p className="text-page-title font-semibold text-civic-800 font-mono">{overallComplianceRate}%</p>
            <span className="text-caption text-slate-400 font-normal">Workforce certification coverage</span>
          </div>

          <div className="p-4 rounded-civic-xl bg-amber-50/50 border border-amber-100 space-y-1">
            <span className="text-amber-800 font-semibold uppercase text-micro flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-600" /> Attention Required
            </span>
            <p className="text-page-title font-semibold text-amber-700 font-mono">{uncertifiedRecords} Modules</p>
            <span className="text-caption text-amber-600 font-normal">Pending certification / review</span>
          </div>
        </div>

        {/* Live Compliance Records Preview */}
        {isLoadingCompliance ? (
          <div className="flex items-center justify-center py-8 gap-2 text-slate-500 text-caption">
            <Loader2 className="h-4 w-4 animate-spin text-civic-700" />
            <span>Loading compliance records...</span>
          </div>
        ) : complianceReport && complianceReport.records.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-micro font-semibold uppercase tracking-wider text-slate-700">
                Workforce Module Certification Ledger ({complianceReport.records.length} Records)
              </h4>
              <span className="text-caption text-slate-400 font-mono font-normal">
                Last Generated: {new Date(complianceReport.generated_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="overflow-x-auto rounded-civic-xl border border-slate-200">
              <table className="w-full text-left text-caption">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-micro uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Officer Email</th>
                    <th className="px-4 py-3">Module</th>
                    <th className="px-4 py-3 text-center">Score</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Credential Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {complianceReport.records.slice(0, 10).map((r, idx) => (
                    <tr key={`${r.employee_email}-${r.module_title}-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {r.employee_email}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {r.module_title}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-slate-800">
                        {r.percentage}% ({r.best_score}/{r.total_score})
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold border ${
                            r.certified
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : r.progress_status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {r.certified ? 'CERTIFIED' : r.progress_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-caption">
                        {r.credential_id ? (
                          <Link
                            to={`/verify/${r.credential_id}`}
                            className="inline-flex items-center gap-1 text-civic-700 hover:text-civic-900 font-semibold hover:underline"
                            title="Verify cryptographic credential"
                          >
                            <span>{r.credential_id}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic">Not Certified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {complianceReport.records.length > 10 && (
              <p className="text-caption text-slate-500 italic text-center pt-1 font-normal">
                Showing top 10 records. Use the "Export Audit (CSV)" button above to download the full {complianceReport.records.length}-record audit trail.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-caption text-slate-400 bg-slate-50 rounded-civic-xl border border-slate-100 font-normal">
            No compliance records found.
          </div>
        )}
      </div>

      {/* SECTION 2: GOVASSIST CITIZEN PRE-SUBMISSION DEFECT TELEMETRY */}
      <div className="bg-white rounded-civic-xl p-6 sm:p-8 border border-slate-200 shadow-civic-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-micro font-semibold text-emerald-700 uppercase tracking-wider">
              <Activity className="h-4 w-4" />
              <span>Citizen Self-Service Quality Intelligence</span>
            </div>
            <h3 className="text-section-heading font-semibold text-slate-900">
              GovAssist Pre-Check Defect Telemetry
            </h3>
            <p className="text-caption text-slate-600 font-normal">
              Real-time analytics on citizen document quality and defect patterns across the 4 deterministic pre-submission rules.
            </p>
          </div>

          {citizenTelemetry && (
            <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 text-caption font-semibold text-emerald-800 shrink-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{citizenTelemetry.pass_rate_pct}% First-Pass Rate</span>
            </div>
          )}
        </div>

        {/* Telemetry Error Alert */}
        {telemetryError && (
          <div className="p-4 rounded-civic-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-caption text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{telemetryError}</span>
          </div>
        )}

        {isLoadingTelemetry ? (
          <div className="flex items-center justify-center py-10 gap-2 text-slate-500 text-caption">
            <Loader2 className="h-5 w-5 animate-spin text-civic-700" />
            <span>Loading citizen defect telemetry...</span>
          </div>
        ) : citizenTelemetry && citizenTelemetry.total_submissions > 0 ? (
          <div className="space-y-6">
            {/* Metrics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-civic-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-500 font-semibold uppercase text-micro">Total Pre-Checks</span>
                <p className="text-page-title font-semibold text-slate-900 font-mono">{citizenTelemetry.total_submissions}</p>
                <span className="text-caption text-slate-400 font-normal">Documents evaluated</span>
              </div>

              <div className="p-4 rounded-civic-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="text-emerald-700 font-semibold uppercase text-micro">Passed Ready for Filing</span>
                <p className="text-page-title font-semibold text-emerald-700 font-mono">{citizenTelemetry.passed_count}</p>
                <span className="text-caption text-emerald-600 font-normal">100% compliant submissions</span>
              </div>

              <div className="p-4 rounded-civic-xl bg-amber-50/60 border border-amber-100 space-y-1">
                <span className="text-amber-800 font-semibold uppercase text-micro">Action Required / Rectified</span>
                <p className="text-page-title font-semibold text-amber-700 font-mono">{citizenTelemetry.action_required_count}</p>
                <span className="text-caption text-amber-600 font-normal">Defects caught pre-filing</span>
              </div>
            </div>

            {/* 4-Rule Defect Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-micro font-semibold uppercase tracking-wider text-slate-700">
                  Deterministic Rule Failure Distribution
                </h4>
                <span className="text-caption text-slate-400 font-normal">4 Core Validation Rules</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {citizenTelemetry.defects_by_rule.map((rule) => (
                  <div
                    key={rule.rule_name}
                    className="p-4 rounded-civic-xl border border-slate-200 bg-slate-50/70 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-caption">
                      <span className="font-semibold text-slate-900">{rule.rule_name}</span>
                      <span className={`font-mono text-caption font-semibold ${rule.failure_count > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {rule.failure_count} failures ({rule.failure_rate_pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          rule.failure_count === 0 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(rule.failure_rate_pct, rule.failure_count > 0 ? 8 : 0))}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-caption text-slate-500 font-normal">
                      <span>Target Field: <code className="font-mono text-slate-700 font-semibold">{rule.field}</code></span>
                      <span className="font-semibold uppercase tracking-wider text-micro px-2 py-0.5 rounded-civic-sm bg-slate-200 text-slate-700">
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
                <h4 className="text-micro font-semibold uppercase tracking-wider text-slate-700">
                  Recent Pre-Submission Inspections
                </h4>

                <div className="overflow-x-auto rounded-civic-xl border border-slate-200">
                  <table className="w-full text-left text-caption">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-micro uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Document Reference</th>
                        <th className="px-4 py-3">Detected Applicant</th>
                        <th className="px-4 py-3 text-center">Pre-Check Status</th>
                        <th className="px-4 py-3">Identified Defects</th>
                        <th className="px-4 py-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      {citizenTelemetry.recent_inspections.map((doc) => (
                        <tr key={doc.document_id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 font-mono text-caption">
                            <Link
                              to={`/citizen?id=${doc.document_id}`}
                              className="text-civic-700 hover:text-civic-900 font-semibold hover:underline inline-flex items-center gap-1"
                              title="Inspect citizen document in GovAssist pre-checker"
                            >
                              <span>{doc.document_id.slice(0, 8)}...</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {doc.extracted_name || <span className="text-slate-400 italic font-normal">Unidentified Scan</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold border ${
                                doc.overall_status === 'PASSED'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              {doc.overall_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-caption text-slate-600">
                            {doc.failed_rules.length > 0 ? (
                              <span className="text-rose-700 font-medium">
                                {doc.failed_rules.join(', ')}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                All 4 checks compliant
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500 font-mono text-caption">
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
          <div className="text-center py-8 text-caption text-slate-400 bg-slate-50 rounded-civic-xl border border-slate-100 font-normal">
            No citizen pre-submission records recorded yet.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GovernanceDashboard;
