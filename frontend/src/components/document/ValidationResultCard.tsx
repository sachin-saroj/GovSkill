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
        <Card className="border-civic-200 bg-white p-6 shadow-civic-sm space-y-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-civic-100 text-civic-700 flex items-center justify-center shadow-civic-xs">
              <Loader2 className="h-5 w-5 animate-spin text-civic-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Executing Deterministic Rule Engine</h4>
              <p className="text-xs text-slate-500">Extracting OCR text & validating 4 compliance rules...</p>
            </div>
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-11 bg-slate-100 rounded-xl animate-pulse" />
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
        <Card className="border-red-200 bg-red-50/50 p-6 shadow-civic-sm space-y-2 rounded-2xl">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <XCircle className="h-5 w-5 shrink-0" />
            <span>Verification Notice</span>
          </div>
          <p className="text-xs text-red-600 leading-relaxed">{error}</p>
        </Card>
      </motion.div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border-slate-200 bg-white p-6 sm:p-8 shadow-civic-sm text-center space-y-3 rounded-2xl">
        <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center shadow-civic-xs">
          <Info className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Document Verified Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
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
          className={`p-5 sm:p-6 border rounded-2xl transition-all ${
            allPassed
              ? 'bg-emerald-50/80 border-emerald-300 shadow-civic-md'
              : 'bg-amber-50/80 border-amber-300 shadow-civic-md'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <motion.div
                initial={shouldReduceMotion ? {} : { scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-civic-xs ${
                  allPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {allPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
              </motion.div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {allPassed ? 'Pre-Submission Verification: PASSED' : 'Pre-Submission Notice: CORRECTIONS NEEDED'}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {recommendedNextStep || (allPassed
                    ? `All ${results.length} compliance rules passed successfully. This document meets standard submission requirements.`
                    : `${failedCount} of ${results.length} checks failed. Review the AI guidance and corrective actions below before formal submission.`)}
                </p>
                {timestamp && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                    <Clock className="h-3 w-3" />
                    <span>Verified at: {new Date(timestamp).toLocaleString()}</span>
                  </span>
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
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Compliance Rules Checklist ({results.length} Checks)
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">100% Deterministic Evaluation</span>
        </div>

        {results.map((rule) => {
          const isExpanded = expandedRule === rule.ruleName;

          return (
            <Card
              key={rule.ruleName}
              className={`p-4 border rounded-2xl transition-all duration-150 ${
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
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {rule.ruleName}
                      </span>
                      {rule.severity === 'critical' && !rule.passed && (
                        <span className="text-[10px] uppercase font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded border border-red-200">
                          Critical
                        </span>
                      )}
                    </div>
                    {rule.reason && (
                      <p className="text-xs text-slate-600 leading-snug">
                        {rule.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-2.5">
                      {rule.recommended_action && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2 text-slate-700 shadow-civic-xs">
                          <ArrowRight className="h-4 w-4 text-civic-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">Recommended Action:</span>
                            <p className="leading-relaxed text-slate-600">{rule.recommended_action}</p>
                          </div>
                        </div>
                      )}

                      {rule.explanation && (
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1 shadow-civic-xs">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-civic-800 uppercase tracking-wide">
                            <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
                            <span>AI Plain-Language Guidance:</span>
                          </div>
                          <p className="leading-relaxed text-slate-700 pl-5">{rule.explanation}</p>
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
