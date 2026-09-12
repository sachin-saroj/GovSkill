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
        <Card className="border-[#D9CFBB] bg-[#EDE4D0] p-6 space-y-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] text-[#2A5B4A] flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#2A5B4A]" />
            </div>
            <div>
              <h4 className="font-serif text-section-heading font-normal text-[#0A0A0A]">Executing Deterministic Rule Engine</h4>
              <p className="text-caption text-[#6B6357] font-normal">Extracting OCR text & validating 4 compliance rules...</p>
            </div>
          </div>
          <div className="space-y-2.5 pt-2">
            <div className="h-11 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB]/60 animate-pulse" />
            <div className="h-11 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB]/60 animate-pulse" />
            <div className="h-11 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB]/60 animate-pulse" />
            <div className="h-11 bg-[#F5EFE0] rounded-xl border border-[#D9CFBB]/60 animate-pulse" />
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
        <Card className="border-[#C97B5A]/30 bg-[#C97B5A]/10 p-6 space-y-2 rounded-2xl">
          <div className="flex items-center gap-2 text-[#C97B5A] font-semibold text-caption">
            <XCircle className="h-5 w-5 shrink-0" />
            <span>Verification Notice</span>
          </div>
          <p className="text-caption text-[#6B6357] leading-relaxed font-normal">{error}</p>
        </Card>
      </motion.div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border-[#D9CFBB] bg-[#EDE4D0] p-6 sm:p-8 text-center space-y-3 rounded-2xl">
        <div className="h-12 w-12 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] text-[#6B6357] mx-auto flex items-center justify-center">
          <Info className="h-6 w-6" />
        </div>
        <h4 className="font-serif text-section-heading font-normal text-[#0A0A0A]">No Document Verified Yet</h4>
        <p className="text-caption text-[#6B6357] max-w-sm mx-auto leading-relaxed font-normal">
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
          className={`p-6 border rounded-2xl transition-all ${
            allPassed
              ? 'bg-[#2A5B4A]/10 border-[#2A5B4A]/30'
              : 'bg-[#C97B5A]/10 border-[#C97B5A]/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${
                  allPassed ? 'bg-[#2A5B4A] text-white' : 'bg-[#C97B5A] text-white'
                }`}
              >
                {allPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-section-heading font-normal text-[#0A0A0A] leading-snug">
                  {allPassed ? 'Pre-Submission Verification: PASSED' : 'Pre-Submission Notice: CORRECTIONS NEEDED'}
                </h3>
                <p className="text-body text-[#0A0A0A] leading-relaxed font-normal">
                  {recommendedNextStep || (allPassed
                    ? `All ${results.length} compliance rules passed successfully. This document meets standard submission requirements.`
                    : `${failedCount} of ${results.length} checks failed. Review the AI guidance and corrective actions below before formal submission.`)}
                </p>
                {timestamp && (
                  <span className="inline-flex items-center gap-1 text-caption font-mono text-[#6B6357] pt-1 font-normal">
                    <Clock className="h-3 w-3" />
                    <span>Verified at: {new Date(timestamp).toLocaleString()}</span>
                  </span>
                )}

                {onGenerateSlip && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onGenerateSlip}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-caption font-semibold transition-all cursor-pointer min-h-[44px] ${
                        allPassed
                          ? 'bg-[#2A5B4A] hover:bg-[#2A5B4A]/90 text-white'
                          : 'bg-[#C97B5A] hover:bg-[#C97B5A]/90 text-white'
                      }`}
                    >
                      <FileCheck2 className="h-4 w-4" />
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
      <motion.div variants={fadeUpVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-micro font-semibold uppercase tracking-wider text-[#6B6357]">
            Compliance Rules Checklist ({results.length} Checks)
          </h4>
          <span className="text-caption font-mono text-[#6B6357] font-normal">100% Deterministic Evaluation</span>
        </div>

        {results.map((rule) => {
          const isExpanded = expandedRule === rule.ruleName;

          return (
            <Card
              key={rule.ruleName}
              className={`p-5 border rounded-2xl transition-all duration-150 ${
                rule.passed
                  ? 'border-[#D9CFBB] bg-[#F5EFE0] hover:border-[#2A5B4A]/50'
                  : 'border-[#C97B5A]/40 bg-[#C97B5A]/5 hover:border-[#C97B5A]'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedRule(isExpanded ? null : rule.ruleName)}
                className="flex w-full items-start justify-between text-left gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {rule.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-[#2A5B4A] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-[#C97B5A] shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-caption text-[#0A0A0A]">
                        {rule.ruleName}
                      </span>
                      {rule.severity === 'critical' && !rule.passed && (
                        <span className="text-micro uppercase font-mono font-semibold text-[#C97B5A] bg-[#C97B5A]/10 px-2 py-0.5 rounded-full border border-[#C97B5A]/30">
                          Critical
                        </span>
                      )}
                    </div>
                    {rule.reason && (
                      <p className="text-caption text-[#6B6357] leading-snug font-normal">
                        {rule.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-3 py-0.5 text-caption font-semibold ${
                      rule.passed
                        ? 'bg-[#2A5B4A]/15 text-[#2A5B4A] border border-[#2A5B4A]/30'
                        : 'bg-[#C97B5A]/15 text-[#C97B5A] border border-[#C97B5A]/30'
                    }`}
                  >
                    {rule.passed ? 'Passed' : 'Action Needed'}
                  </span>
                  <span className="text-[#6B6357]">
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
                    <div className="mt-4 pt-3.5 border-t border-[#D9CFBB] text-caption space-y-3 font-normal">
                      {rule.recommended_action && (
                        <div className="p-4 bg-[#EDE4D0] rounded-xl border border-[#D9CFBB] flex items-start gap-2.5 text-[#0A0A0A]">
                          <ArrowRight className="h-4 w-4 text-[#2A5B4A] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-[#0A0A0A] block">Recommended Action:</span>
                            <p className="leading-relaxed text-[#6B6357] font-normal">{rule.recommended_action}</p>
                          </div>
                        </div>
                      )}

                      {rule.explanation && (
                        <div className="p-4 bg-[#EDE4D0] rounded-xl border border-[#D9CFBB] text-[#0A0A0A] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-micro font-semibold text-[#0A0A0A] uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5 text-[#C9A24A]" />
                            <span>AI Plain-Language Guidance:</span>
                          </div>
                          <p className="leading-relaxed text-[#6B6357] pl-5 font-normal">{rule.explanation}</p>
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
