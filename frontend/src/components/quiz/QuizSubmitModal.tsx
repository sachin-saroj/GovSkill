import React from 'react';
import Button from '@/components/ui/Button';
import { AlertTriangle, CheckCircle2, Flag, Loader2 } from 'lucide-react';

interface QuizSubmitModalProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  isSubmitting: boolean;
  onConfirmSubmit: () => void;
  onCancel: () => void;
}

export const QuizSubmitModal: React.FC<QuizSubmitModalProps> = ({
  isOpen,
  totalQuestions,
  answeredCount,
  flaggedCount,
  isSubmitting,
  onConfirmSubmit,
  onCancel,
}) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;
  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-civic-xl border border-slate-200 space-y-5 animate-scale-in">
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
              hasUnanswered ? 'bg-amber-100 text-amber-800' : 'bg-civic-100 text-civic-800'
            }`}
          >
            {hasUnanswered ? (
              <AlertTriangle className="h-6 w-6 text-amber-700" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-civic-800" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              Confirm Assessment Submission
            </h3>
            <p className="text-xs text-slate-500">
              Your answers will be evaluated server-side for official competency scoring.
            </p>
          </div>
        </div>

        {/* Assessment Status Summary Box */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-700">
            <span>Total Questions:</span>
            <span className="font-bold text-slate-900">{totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span>Answered:</span>
            <span className="font-bold text-emerald-700">
              {answeredCount} of {totalQuestions}
            </span>
          </div>

          {flaggedCount > 0 && (
            <div className="flex justify-between items-center text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Flag className="h-3.5 w-3.5 text-amber-700 fill-amber-700" />
                <span>Flagged for Review:</span>
              </span>
              <span className="font-bold">{flaggedCount}</span>
            </div>
          )}

          {hasUnanswered && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-tight">
                <strong>Notice:</strong> You have <strong>{unansweredCount}</strong> unanswered question(s). Unanswered questions will receive 0 points.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-xs shadow-civic-xs"
          >
            Keep Reviewing
          </Button>
          <Button
            type="button"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="text-xs shadow-civic-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                <span>Evaluating...</span>
              </>
            ) : (
              <span>Submit Assessment</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizSubmitModal;
