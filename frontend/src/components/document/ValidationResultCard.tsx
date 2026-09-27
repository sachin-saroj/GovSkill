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
        <Card className="border-[#E4E4E7] bg-white p-6 space-y-4 rounded-none shadow-none">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#AF411E]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] block">
                Rule Engine Execution
              </span>
              <h3 className="font-sans font-bold text-base text-[#09090B] uppercase tracking-tight">
                Executing Deterministic Rule Engine
              </h3>
              <p className="text-caption text-[#71717A]">
                Extracting OCR text & validating 4 compliance rules...
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-10 bg-[#FAFAFA] border border-[#E4E4E7] animate-pulse" />
            <div className="h-10 bg-[#FAFAFA] border border-[#E4E4E7] animate-pulse" />
            <div className="h-10 bg-[#FAFAFA] border border-[#E4E4E7] animate-pulse" />
            <div className="h-10 bg-[#FAFAFA] border border-[#E4E4E7] animate-pulse" />
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
        <Card className="border-l-4 border-l-[#AF411E] border-[#E4E4E7] bg-white p-6 space-y-2 rounded-none shadow-none">
          <div className="flex items-center gap-2 text-[#AF411E] font-bold text-xs uppercase tracking-wider">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>Verification Notice</span>
          </div>
          <p className="text-caption text-[#71717A] leading-relaxed">{error}</p>
        </Card>
      </motion.div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border border-[#E4E4E7] bg-white p-8 text-center space-y-3 rounded-none shadow-none">
        <div className="h-12 w-12 bg-[#FAFAFA] border border-[#E4E4E7] text-[#71717A] mx-auto flex items-center justify-center">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] block">
            Awaiting Document
          </span>
          <h3 className="font-sans font-bold text-lg uppercase tracking-tight text-[#09090B] mt-1">
            No Document Verified Yet
          </h3>
        </div>
        <p className="text-caption text-[#71717A] max-w-sm mx-auto leading-relaxed">
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
          className={`p-6 border rounded-none transition-all shadow-none ${
            allPassed
              ? 'bg-white border-[#E4E4E7] border-l-4 border-l-emerald-600'
              : 'bg-white border-[#E4E4E7] border-l-4 border-l-[#AF411E]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`h-11 w-11 flex items-center justify-center shrink-0 border ${
                  allPassed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-orange-50 text-[#AF411E] border-orange-200'
                }`}
              >
                {allPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] block">
                  {allPassed ? 'Validation Status: Complete' : 'Validation Status: Attention Required'}
                </span>
                <h3 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B] leading-snug">
                  {allPassed ? 'Pre-Submission Verification: PASSED' : 'Pre-Submission Notice: CORRECTIONS NEEDED'}
                </h3>
                <p className="text-body text-[#3F3F46] leading-relaxed">
                  {recommendedNextStep || (allPassed
                    ? `All ${results.length} compliance rules passed successfully. This document meets standard submission requirements.`
                    : `${failedCount} of ${results.length} checks failed. Review the AI guidance and corrective actions below before formal submission.`)}
                </p>
                {timestamp && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#71717A] pt-1">
                    <Clock className="h-3 w-3" />
                    <span>Verified at: {new Date(timestamp).toLocaleString()}</span>
                  </span>
                )}

                {onGenerateSlip && (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onGenerateSlip}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                        allPassed
                          ? 'bg-[#09090B] hover:bg-[#27272A] text-white border-[#09090B]'
                          : 'bg-[#AF411E] hover:bg-[#8F3316] text-white border-[#AF411E]'
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
              className="shrink-0 rounded-none uppercase font-mono text-xs tracking-wider"
            >
              {passedCount}/{totalCount} Rules Passed
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Detailed Rule Breakdown List */}
      <motion.div variants={fadeUpVariants} className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#09090B]">
            Compliance Rules Checklist ({results.length} Checks)
          </h4>
          <span className="text-[11px] font-mono text-[#71717A]">
            100% Deterministic Evaluation
          </span>
        </div>

        {results.map((rule) => {
          const isExpanded = expandedRule === rule.ruleName;

          return (
            <div
              key={rule.ruleName}
              className={`p-5 border transition-all duration-150 ${
                rule.passed
                  ? 'border-[#E4E4E7] bg-white hover:border-[#A1A1AA]'
                  : 'border-[#E4E4E7] border-l-2 border-l-[#AF411E] bg-[#FAFAFA] hover:border-[#71717A]'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedRule(isExpanded ? null : rule.ruleName)}
                className="flex w-full items-start justify-between text-left gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {rule.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-[#AF411E] shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#09090B]">
                        {rule.ruleName}
                      </span>
                      {rule.severity === 'critical' && !rule.passed && (
                        <span className="text-[10px] uppercase font-mono font-bold text-[#AF411E] bg-orange-50 px-2 py-0.5 border border-orange-200">
                          Critical
                        </span>
                      )}
                    </div>
                    {rule.reason && (
                      <p className="text-caption text-[#71717A] leading-snug">
                        {rule.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-mono uppercase font-bold border ${
                      rule.passed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-orange-50 text-[#AF411E] border-orange-200'
                    }`}
                  >
                    {rule.passed ? 'Passed' : 'Action Needed'}
                  </span>
                  <span className="text-[#71717A]">
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
                    <div className="mt-4 pt-4 border-t border-[#E4E4E7] text-caption space-y-3">
                      {rule.recommended_action && (
                        <div className="p-4 bg-white border border-[#E4E4E7] flex items-start gap-3 text-[#09090B]">
                          <ArrowRight className="h-4 w-4 text-[#AF411E] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#AF411E] block mb-0.5">
                              Recommended Action
                            </span>
                            <p className="leading-relaxed text-[#3F3F46] font-medium">{rule.recommended_action}</p>
                          </div>
                        </div>
                      )}

                      {rule.explanation && (
                        <div className="p-4 bg-white border border-[#E4E4E7] text-[#09090B] space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-[0.2em]">
                            <Sparkles className="h-3.5 w-3.5 text-[#EE8148]" />
                            <span>AI Plain-Language Guidance</span>
                          </div>
                          <p className="leading-relaxed text-[#3F3F46] font-medium pl-5.5">{rule.explanation}</p>
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
