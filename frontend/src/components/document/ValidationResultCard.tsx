import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ValidationRuleResult } from '@/types';

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
      <div className="flex items-center gap-2 rounded-xl border border-[#E2E6EB] bg-white p-6 shadow-sm text-[#5A6472]">
        <Loader2 className="h-4 w-4 animate-spin text-[#1E4D8C]" />
        <span className="text-sm">Processing document & running validation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-6 text-sm text-[#C0392B]">
        {error}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="rounded-xl border border-[#E2E6EB] bg-white p-6 text-sm text-[#5A6472]">
        No document uploaded yet. Upload an Income Certificate above to run validation rules.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#1A1F2B] mb-2">Rule Engine Results</h3>
      {results.map((rule) => (
        <div key={rule.ruleName} className="rounded-xl border border-[#E2E6EB] bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setExpandedRule(expandedRule === rule.ruleName ? null : rule.ruleName)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="flex items-center gap-2 font-medium text-[#1A1F2B]">
              {rule.passed ? (
                <CheckCircle2 className="h-4 w-4 text-[#2E9E6B]" />
              ) : (
                <XCircle className="h-4 w-4 text-[#C0392B]" />
              )}
              {rule.ruleName}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                rule.passed ? 'bg-[#2E9E6B]/10 text-[#2E9E6B]' : 'bg-[#C0392B]/10 text-[#C0392B]'
              }`}
            >
              {rule.passed ? 'Passed' : 'Failed'}
            </span>
          </button>
          {expandedRule === rule.ruleName && rule.explanation && (
            <div className="mt-3 pt-3 border-t border-[#E2E6EB] text-sm text-[#5A6472] bg-[#F7F9FB] p-3 rounded-lg">
              <span className="font-medium text-[#1A1F2B] block mb-1">AI Explanation & Guidance:</span>
              {rule.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default ValidationResultCard;
