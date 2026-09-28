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
          Upload an Income Certificate above to run automated pre-submission compliance checks.
        </p>
      </Card>
    );
  }

  const allPassed = overallStatus ? overallStatus === 'PASSED' : results.every((r) => r.passed);
  const passedCount = passedRulesCount ?? results.filter((r) => r.passed).length;
  const totalCount = totalRulesCount ?? results.length;
  const failedCount = totalCount - passedCount;

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Overall Verification Status Banner */}
      <motion.div variants={fadeUpVariants}>
        <div
          className={`p-6 border rounded-2xl transition-all shadow-sm ${
            allPassed
              ? 'bg-surface border-border-warm border-l-4 border-l-sage'
              : 'bg-surface border-border-warm border-l-4 border-l-rose'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`h-11 w-11 flex items-center justify-center shrink-0 rounded-xl border ${
                  allPassed
                    ? 'bg-sage/15 text-sage border-sage/30'
                    : 'bg-rose/15 text-rose border-rose/30'
                }`}
              >
                {allPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted block">
                  {allPassed ? 'Validation Status: Complete' : 'Validation Status: Attention Required'}
                </span>
                <h3 className="font-sans font-bold text-lg uppercase tracking-tight text-ink leading-snug">
                  {allPassed ? 'Pre-Submission Verification: PASSED' : 'Pre-Submission Notice: CORRECTIONS NEEDED'}
                </h3>
                <p className="text-body text-ink leading-relaxed">
                  {recommendedNextStep || (allPassed
                    ? `All ${results.length} compliance rules passed successfully. This document meets standard submission requirements.`
                    : `${failedCount} of ${results.length} checks failed. Review the AI guidance and corrective actions below before formal submission.`)}
                </p>
                {timestamp && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-muted pt-1">
                    <Clock className="h-3 w-3" />
                    <span>Verified at: {new Date(timestamp).toLocaleString()}</span>
                  </span>
                )}

                {onGenerateSlip && (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onGenerateSlip}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer border shadow-xs ${
                        allPassed
                          ? 'bg-ink hover:bg-ink/90 text-on-ink border-ink'
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
              variant={allPassed ? 'success' : 'warning'}
              size="md"
              className="shrink-0 rounded-full uppercase font-mono text-xs tracking-wider"
            >
              {passedCount}/{totalCount} Rules Passed
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Detailed Rule Breakdown List */}
      <motion.div variants={fadeUpVariants} className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border-warm/70">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
            Compliance Rules Checklist ({results.length} Checks)
          </h4>
          <span className="text-[11px] font-mono text-ink-muted">
            100% Deterministic Evaluation
          </span>
        </div>

        {results.map((rule) => {
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
        })}
      </motion.div>
    </motion.div>
  );
};

export default ValidationResultCard;
