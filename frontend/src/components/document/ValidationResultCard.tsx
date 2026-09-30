import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';
import { ValidationRuleResult } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion';

interface ValidationResultCardProps {
  results: ValidationRuleResult[] | null;
  overallStatus?: string;
  documentType?: string;
  displayName?: string;
  extractionSource?: string;
  ocrQuality?: string;
  passedRulesCount?: number;
  totalRulesCount?: number;
  recommendedNextStep?: string;
  timestamp?: string;
  isLoading: boolean;
  error?: string | null;
  onGenerateSlip?: () => void;
}

export const ValidationResultCard: React.FC<ValidationResultCardProps> = ({
  results,
  overallStatus,
  documentType,
  displayName,
  extractionSource,
  ocrQuality,
  passedRulesCount,
  totalRulesCount,
  recommendedNextStep,
  timestamp,
  isLoading,
  error,
  onGenerateSlip,
}) => {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card className="border-border-warm bg-surface p-6 space-y-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-surface-light border border-border-warm rounded-xl text-ink flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-rose" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted block">
                Rule Engine Execution
              </span>
              <h3 className="font-sans font-bold text-base text-ink uppercase tracking-tight">
                Executing Deterministic Rule Engine
              </h3>
              <p className="text-caption text-ink-muted">
                Extracting OCR text & validating 4 compliance rules...
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-10 bg-surface-light rounded-xl border border-border-warm animate-pulse" />
            <div className="h-10 bg-surface-light rounded-xl border border-border-warm animate-pulse" />
            <div className="h-10 bg-surface-light rounded-xl border border-border-warm animate-pulse" />
            <div className="h-10 bg-surface-light rounded-xl border border-border-warm animate-pulse" />
          </div>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-l-4 border-l-rose border-border-warm bg-surface p-6 space-y-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-rose font-bold text-xs uppercase tracking-wider">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>Verification Notice</span>
          </div>
          <p className="text-caption text-ink-muted leading-relaxed">{error}</p>
        </Card>
      </motion.div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border border-border-warm bg-surface p-8 text-center space-y-3 rounded-2xl shadow-sm">
        <div className="h-12 w-12 bg-surface-light border border-border-warm rounded-xl text-ink-muted mx-auto flex items-center justify-center">
          <Info className="h-5 w-5 text-civic" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted block">
            Awaiting Document
          </span>
          <h3 className="font-sans font-bold text-lg uppercase tracking-tight text-ink mt-1">
            No Document Verified Yet
          </h3>
        </div>
        <p className="text-caption text-ink-muted max-w-sm mx-auto leading-relaxed">
          Upload a civic certificate or identity document above to run automated pre-submission compliance checks.
        </p>
      </Card>
    );
  }

  const isUnknown = overallStatus === 'UNKNOWN_DOCUMENT';
  const isUnsupported = overallStatus === 'UNSUPPORTED_DOCUMENT';
  const isExtractionIncomplete = overallStatus === 'EXTRACTION_INCOMPLETE';
  const isExtractionSupported =
    overallStatus === 'SUPPORTED FOR EXTRACTION — FORMAL VALIDATION UNAVAILABLE' ||
    overallStatus === 'SUPPORTED_FOR_EXTRACTION';
  const isPassed = overallStatus === 'PASSED' || overallStatus === 'VERIFIED AGAINST AVAILABLE RULES';
  const passedCount = passedRulesCount ?? results.filter((r) => r.passed).length;
  const totalCount = totalRulesCount ?? results.length;
  const failedCount = totalCount - passedCount;

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      aria-live="polite"
      className="space-y-6"
    >
      {/* Overall Verification Status Banner */}
      <motion.div variants={fadeUpVariants}>
        <div
          className={`p-6 border rounded-2xl transition-all shadow-sm ${
            isUnknown
              ? 'bg-surface border-border-warm border-l-4 border-l-amber-500'
              : isUnsupported
              ? 'bg-surface border-border-warm border-l-4 border-l-slate-400'
              : isExtractionIncomplete
              ? 'bg-surface border-border-warm border-l-4 border-l-amber-500'
              : isExtractionSupported
              ? 'bg-surface border-border-warm border-l-4 border-l-civic'
              : isPassed
              ? 'bg-surface border-border-warm border-l-4 border-l-sage'
              : 'bg-surface border-border-warm border-l-4 border-l-rose'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`h-11 w-11 flex items-center justify-center shrink-0 rounded-xl border ${
                  isUnknown
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : isUnsupported
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : isExtractionIncomplete
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : isExtractionSupported
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : isPassed
                    ? 'bg-sage/15 text-sage border-sage/30'
                    : 'bg-rose/15 text-rose border-rose/30'
                }`}
              >
                {isPassed ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : isExtractionSupported ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted block">
                  {isUnknown
                    ? 'Validation Status: Unrecognized Document'
                    : isUnsupported
                    ? 'Validation Status: Unsupported Category'
                    : isExtractionIncomplete
                    ? 'Validation Status: Incomplete Scan'
                    : isExtractionSupported
                    ? 'Validation Status: Format & Consistency Checked'
                    : isPassed
                    ? 'Validation Status: Complete'
                    : 'Validation Status: Attention Required'}
                </span>
                <h3 className="font-sans font-bold text-lg uppercase tracking-tight text-ink leading-snug">
                  {isUnknown
                    ? 'Pre-Submission Notice: DOCUMENT TYPE UNRECOGNIZED'
                    : isUnsupported
                    ? 'Pre-Submission Notice: AUTOMATED PRE-CHECK UNAVAILABLE'
                    : isExtractionIncomplete
                    ? 'Pre-Submission Notice: SCAN QUALITY INSUFFICIENT'
                    : isExtractionSupported
                    ? `Pre-Submission Notice: ${displayName ? displayName.toUpperCase() : 'DOCUMENT'} FORMAT EXTRACTED`
                    : isPassed
                    ? 'Pre-Submission Verification: PASSED'
                    : 'Pre-Submission Notice: CORRECTIONS NEEDED'}
                </h3>
                <p className="text-body text-ink leading-relaxed">
                  {recommendedNextStep ||
                    (isUnknown
                      ? 'Document type could not be confidently identified. Please ensure the document is a supported civic certificate with clear headers.'
                      : isUnsupported
                      ? `The uploaded document (${displayName || 'unsupported'}) belongs to a category not currently supported for automated verification.`
                      : isExtractionIncomplete
                      ? 'Document text is unreadable or essential fields are missing. Please upload a higher resolution scan.'
                      : isExtractionSupported
                      ? 'Document extracted and format consistency verified against civic schema. Official authenticity or statutory legal validity was not verified.'
                      : isPassed
                      ? `All ${results.length} compliance rules passed successfully. This document meets standard submission requirements.`
                      : `${failedCount} of ${results.length} checks failed. Review the AI guidance and corrective actions below before formal submission.`)}
                </p>
                {timestamp && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-muted pt-1">
                    <Clock className="h-3 w-3" />
                    <span>Verified at: {new Date(timestamp).toLocaleString()}</span>
                  </span>
                )}

                {(documentType || extractionSource || ocrQuality) && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-ink-muted">
                    {displayName && <span>Type: <strong className="text-ink font-semibold">{displayName}</strong></span>}
                    {documentType && <span className="text-border-warm">•</span>}
                    {extractionSource && (
                      <span>
                        Engine: <strong className="text-ink font-semibold">{extractionSource === 'VISION_AI' ? 'Vision-Assisted' : 'Deterministic OCR'}</strong>
                      </span>
                    )}
                    {ocrQuality && <span className="text-border-warm">•</span>}
                    {ocrQuality && <span>Quality: <strong className="text-ink font-semibold">{ocrQuality}</strong></span>}
                  </div>
                )}

                {onGenerateSlip && !isUnknown && (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onGenerateSlip}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer border shadow-xs ${
                        isPassed
                          ? 'bg-ink hover:bg-ink/90 text-on-ink border-ink'
                          : isExtractionSupported
                          ? 'bg-surface-elevated hover:bg-surface-light text-ink border-border-warm'
                          : 'bg-rose hover:bg-rose/90 text-white border-rose'
                      }`}
                    >
                      <FileCheck2 className="h-4 w-4" />
                      <span>View & Print Pre-Submission Counter Slip</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Badge
              variant={
                isUnknown
                  ? 'warning'
                  : isUnsupported
                  ? 'neutral'
                  : isExtractionIncomplete
                  ? 'warning'
                  : isExtractionSupported
                  ? 'info'
                  : isPassed
                  ? 'success'
                  : 'warning'
              }
              size="md"
              className="shrink-0 rounded-full uppercase font-mono text-xs tracking-wider"
            >
              {isUnknown
                ? 'Unrecognized Document'
                : isUnsupported
                ? 'Unsupported Type'
                : isExtractionIncomplete
                ? 'Scan Incomplete'
                : isExtractionSupported
                ? `${passedCount}/${totalCount} Checks Verified`
                : `${passedCount}/${totalCount} Rules Passed`}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Detailed Rule Breakdown List */}
      <motion.div variants={fadeUpVariants} className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border-warm/70">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
            {isUnknown || isUnsupported
              ? 'Compliance Verification Status'
              : documentType === 'income_certificate'
              ? `Validation Checks (${results.length})`
              : `Extraction & Consistency Checks (${results.length})`}
          </h4>
          <span className="text-[11px] font-mono text-ink-muted">
            100% Deterministic Evaluation
          </span>
        </div>

        {results.length === 0 ? (
          <div className="p-6 bg-surface-light rounded-2xl border border-border-warm text-center space-y-2">
            <Info className="h-5 w-5 text-ink-muted mx-auto" />
            <p className="font-bold text-sm text-ink">
              {isUnknown
                ? 'No Compliance Rules Evaluated'
                : isUnsupported
                ? 'Automated Rules Not Available For This Category'
                : 'No rule results recorded'}
            </p>
            <p className="text-caption text-ink-muted max-w-md mx-auto">
              {isUnknown
                ? 'Because the document category could not be established, statutory verification rules were not run. Please upload a clear certificate with recognizable headers.'
                : 'GovSkill only runs authoritative automated validation on supported civic document types (e.g. Income Certificate).'}
            </p>
          </div>
        ) : (
          results.map((rule) => {
            const isExpanded = expandedRule === rule.ruleName;

          return (
            <div
              key={rule.ruleName}
              className={`p-5 border rounded-2xl transition-all duration-150 shadow-xs ${
                rule.passed
                  ? 'border-border-warm bg-surface hover:border-border-warm/90'
                  : 'border-border-warm border-l-4 border-l-rose bg-surface hover:border-border-warm/90'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedRule(isExpanded ? null : rule.ruleName)}
                className="flex w-full items-start justify-between text-left gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {rule.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-sage shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ink">
                        {rule.ruleName}
                      </span>
                      {rule.severity === 'critical' && !rule.passed && (
                        <span className="text-[10px] uppercase font-mono font-bold text-rose bg-rose/15 px-2 py-0.5 rounded-full border border-rose/30">
                          Critical
                        </span>
                      )}
                    </div>
                    {rule.reason && (
                      <p className="text-caption text-ink-muted leading-snug">
                        {rule.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-mono uppercase font-bold rounded-full border ${
                      rule.passed
                        ? 'bg-sage/15 text-sage border-sage/30'
                        : 'bg-rose/15 text-rose border-rose/30'
                    }`}
                  >
                    {rule.passed ? 'Passed' : 'Action Needed'}
                  </span>
                  <span className="text-ink-muted">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </div>
              </button>

              {/* Recommended Action & AI Explanation Accordion with AnimatePresence */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border-warm/70 text-caption space-y-3">
                      {rule.recommended_action && (
                        <div className="p-4 bg-surface-light rounded-xl border border-border-warm flex items-start gap-3 text-ink">
                          <ArrowRight className="h-4 w-4 text-rose shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose font-bold block mb-0.5">
                              Recommended Action
                            </span>
                            <p className="leading-relaxed text-ink font-medium">{rule.recommended_action}</p>
                          </div>
                        </div>
                      )}

                      {rule.explanation && (
                        <div className="p-4 bg-surface-light rounded-xl border border-border-warm text-ink space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-saffron uppercase tracking-[0.2em]">
                            <Sparkles className="h-3.5 w-3.5 text-saffron" />
                            <span>AI Plain-Language Guidance</span>
                          </div>
                          <p className="leading-relaxed text-ink font-medium pl-5.5">{rule.explanation}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }))}
      </motion.div>
    </motion.div>
  );
};

export default ValidationResultCard;
