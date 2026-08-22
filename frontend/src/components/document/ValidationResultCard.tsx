import React, { useState } from 'react';
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
} from 'lucide-react';
import { ValidationRuleResult } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ValidationResultCardProps {
  results: ValidationRuleResult[] | null;
  isLoading: boolean;
  error?: string | null;
}

export const ValidationResultCard: React.FC<ValidationResultCardProps> = ({
  results,
  isLoading,
  error,
}) => {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="border-civic-200 bg-white p-6 shadow-civic-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-civic-100 text-civic-700 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Executing Deterministic Rule Engine</h4>
            <p className="text-xs text-slate-500">Extracting OCR text & validating 4 compliance rules...</p>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50 p-6 shadow-civic-sm space-y-2">
        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>Verification Notice</span>
        </div>
        <p className="text-xs text-red-600 leading-relaxed">{error}</p>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border-slate-200 bg-white p-6 sm:p-8 shadow-civic-sm text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Info className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Document Verified Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          No document uploaded yet. Upload an Income Certificate above to run validation rules.
        </p>
      </Card>
    );
  }

  const allPassed = results.every((r) => r.passed);
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;

  return (
    <div className="space-y-4">
      {/* Overall Verification Status Banner */}
      <Card
        className={`p-5 border transition-all ${
          allPassed
            ? 'bg-emerald-50/80 border-emerald-300 shadow-civic-sm'
            : 'bg-amber-50/80 border-amber-300 shadow-civic-sm'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                allPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {allPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {allPassed ? 'Pre-Submission Verification: PASSED' : 'Pre-Submission Notice: CORRECTIONS NEEDED'}
                </h3>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {allPassed
                  ? `All ${results.length} compliance rules passed successfully. This document meets standard submission requirements.`
                  : `${failedCount} of ${results.length} checks failed. Review the AI guidance below before visiting the administrative office.`}
              </p>
            </div>
          </div>

          <Badge variant={allPassed ? 'success' : 'warning'} size="md">
            {passedCount}/{results.length} Rules Passed
          </Badge>
        </div>
      </Card>

      {/* Detailed Rule Breakdown List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Rule Engine Results ({results.length} Checks)
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">Deterministic Evaluation</span>
        </div>

        {results.map((rule) => {
          const hasExplanation = !!rule.explanation;
          const isExpanded = expandedRule === rule.ruleName;

          return (
            <Card
              key={rule.ruleName}
              className={`p-4 border transition-all duration-150 ${
                rule.passed
                  ? 'border-slate-200 bg-white hover:border-emerald-200 shadow-civic-xs'
                  : 'border-red-200 bg-red-50/20 hover:border-red-300 shadow-civic-xs'
              }`}
            >
              <button
                type="button"
                disabled={!hasExplanation}
                onClick={() => setExpandedRule(isExpanded ? null : rule.ruleName)}
                className={`flex w-full items-center justify-between text-left gap-3 ${
                  hasExplanation ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {rule.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                    {rule.ruleName}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      rule.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {rule.passed ? 'Passed' : 'Failed'}
                  </span>
                  {hasExplanation && (
                    <span className="text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </button>

              {/* AI Explanation Accordion */}
              {isExpanded && rule.explanation && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg space-y-1.5 animate-slide-up">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-civic-800 uppercase tracking-wide">
                    <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
                    <span>AI Explanation & Guidance:</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 pl-5">{rule.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ValidationResultCard;
