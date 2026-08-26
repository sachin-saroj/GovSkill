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
        <Card className="border-civic-200 bg-white p-6 shadow-civic-sm space-y-4 rounded-civic-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-civic-md bg-civic-100 text-civic-700 flex items-center justify-center shadow-civic-xs">
              <Loader2 className="h-5 w-5 animate-spin text-civic-700" />
            </div>
            <div>
              <h4 className="text-section-heading font-semibold text-slate-900">Executing Deterministic Rule Engine</h4>
              <p className="text-caption text-slate-500 font-normal">Extracting OCR text & validating 4 compliance rules...</p>
            </div>
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-11 bg-slate-100 rounded-civic-md animate-pulse" />
            <div className="h-11 bg-slate-100 rounded-civic-md animate-pulse" />
            <div className="h-11 bg-slate-100 rounded-civic-md animate-pulse" />
            <div className="h-11 bg-slate-100 rounded-civic-md animate-pulse" />
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
        <Card className="border-red-200 bg-red-50/50 p-6 shadow-civic-sm space-y-2 rounded-civic-xl">
          <div className="flex items-center gap-2 text-red-700 font-semibold text-caption">
            <XCircle className="h-5 w-5 shrink-0" />
            <span>Verification Notice</span>
          </div>
          <p className="text-caption text-red-600 leading-relaxed font-normal">{error}</p>
        </Card>
      </motion.div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border-slate-200 bg-white p-6 sm:p-8 shadow-civic-sm text-center space-y-3 rounded-civic-xl">
        <div className="h-12 w-12 rounded-civic-lg bg-slate-100 text-slate-400 mx-auto flex items-center justify-center shadow-civic-xs">
          <Info className="h-6 w-6" />
        </div>
        <h4 className="text-section-heading font-semibold text-slate-800">No Document Verified Yet</h4>
        <p className="text-caption text-slate-500 max-w-sm mx-auto leading-relaxed font-normal">
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
      className="space-y-4"
    >
      {/* Overall Verification Status Banner */}
      <motion.div variants={fadeUpVariants}>
        <Card
          className={`p-6 border rounded-civic-xl transition-all ${
            allPassed
              ? 'bg-emerald-50/80 border-emerald-300 shadow-civic-md'
              : 'bg-amber-50/80 border-amber-300 shadow-civic-md'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div
                className={`h-11 w-11 rounded-civic-md flex items-center justify-center shrink-0 shadow-civic-xs ${
                  allPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {allPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-section-heading font-semibold text-slate-900">
                  {allPassed ? 'Pre-Submission Verification: PASSED' : 'Pre-Submission Notice: CORRECTIONS NEEDED'}
                </h3>
                <p className="text-caption text-slate-700 leading-relaxed font-normal">
                  {recommendedNextStep || (allPassed
                    ? `All ${results.length} compliance rules passed successfully. This document meets standard submission requirements.`
                    : `${failedCount} of ${results.length} checks failed. Review the AI guidance and corrective actions below before formal submission.`)}
                </p>
                {timestamp && (
                  <span className="inline-flex items-center gap-1 text-caption text-slate-500 pt-1 font-normal">
                    <Clock className="h-3 w-3" />
                    <span>Verified at: {new Date(timestamp).toLocaleString()}</span>
                  </span>
                )}

                {onGenerateSlip && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onGenerateSlip}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-civic-md text-caption font-semibold transition-all shadow-civic-xs cursor-pointer active:scale-95 ${
                        allPassed
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-amber-700 hover:bg-amber-800 text-white'
                      }`}
                    >
                      <FileCheck2 className="h-3.5 w-3.5" />
                      <span>View & Print Pre-Submission Counter Slip</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Badge variant={allPassed ? 'success' : 'warning'} size="md" className="shrink-0">
              {passedCount}/{totalCount} Rules Passed
            </Badge>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Rule Breakdown List */}
      <motion.div variants={fadeUpVariants} className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-micro font-semibold uppercase tracking-wider text-slate-700">
            Compliance Rules Checklist ({results.length} Checks)
          </h4>
          <span className="text-caption text-slate-400 font-normal">100% Deterministic Evaluation</span>
        </div>

        {results.map((rule) => {
          const isExpanded = expandedRule === rule.ruleName;

          return (
            <Card
              key={rule.ruleName}
              className={`p-4 border rounded-civic-lg transition-all duration-150 ${
                rule.passed
                  ? 'border-slate-200 bg-white hover:border-emerald-200 shadow-civic-xs'
                  : 'border-amber-300 bg-amber-50/30 hover:border-amber-400 shadow-civic-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedRule(isExpanded ? null : rule.ruleName)}
                className="flex w-full items-start justify-between text-left gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {rule.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-caption text-slate-900">
                        {rule.ruleName}
                      </span>
                      {rule.severity === 'critical' && !rule.passed && (
                        <span className="text-micro uppercase font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-civic-sm border border-red-200">
                          Critical
                        </span>
                      )}
                    </div>
                    {rule.reason && (
                      <p className="text-caption text-slate-600 leading-snug font-normal">
                        {rule.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-caption font-semibold ${
                      rule.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {rule.passed ? 'Passed' : 'Action Needed'}
                  </span>
                  <span className="text-slate-400">
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
                    <div className="mt-3 pt-3 border-t border-slate-200 text-caption space-y-2.5 font-normal">
                      {rule.recommended_action && (
                        <div className="p-3 bg-white rounded-civic-md border border-slate-200 flex items-start gap-2 text-slate-700 shadow-civic-xs">
                          <ArrowRight className="h-4 w-4 text-civic-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900 block">Recommended Action:</span>
                            <p className="leading-relaxed text-slate-600 font-normal">{rule.recommended_action}</p>
                          </div>
                        </div>
                      )}

                      {rule.explanation && (
                        <div className="p-3.5 bg-slate-50 rounded-civic-md border border-slate-200 text-slate-700 space-y-1 shadow-civic-xs">
                          <div className="flex items-center gap-1.5 text-micro font-semibold text-civic-800 uppercase tracking-wide">
                            <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
                            <span>AI Plain-Language Guidance:</span>
                          </div>
                          <p className="leading-relaxed text-slate-700 pl-5 font-normal">{rule.explanation}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default ValidationResultCard;
