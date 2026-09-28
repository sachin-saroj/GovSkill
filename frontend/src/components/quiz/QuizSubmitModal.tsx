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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-border-warm space-y-5 animate-scale-in">
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div
            className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${
              hasUnanswered ? 'bg-rose-500/15 text-rose-900 border-rose-500/30' : 'bg-sage-500/15 text-sage-900 border-sage-500/30'
            }`}
          >
            {hasUnanswered ? (
              <AlertTriangle className="h-5 w-5 text-rose-700" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-sage-700" />
            )}
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-ink leading-snug tracking-tight">
              Confirm Assessment Submission
            </h3>
            <p className="text-xs text-ink-muted">
              Your answers will be evaluated server-side for official competency scoring.
            </p>
          </div>
        </div>

        {/* Assessment Status Summary Box */}
        <div className="bg-surface-light p-4 sm:p-5 rounded-2xl border border-border-warm space-y-2.5 text-xs font-mono">
          <div className="flex justify-between items-center text-ink-muted">
            <span>Total Questions:</span>
            <span className="font-bold text-ink">{totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center text-ink-muted">
            <span>Answered:</span>
            <span className="font-bold text-sage-900">
              {answeredCount} of {totalQuestions}
            </span>
          </div>

          {flaggedCount > 0 && (
            <div className="flex justify-between items-center text-rose-900 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/30">
              <span className="inline-flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5 text-rose-600 fill-rose-600" />
                <span>Flagged for Review:</span>
              </span>
              <span className="font-bold">{flaggedCount}</span>
            </div>
          )}

          {hasUnanswered && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-950 flex items-start gap-2 font-sans">
              <AlertTriangle className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-normal text-rose-900">
                <strong className="font-semibold text-rose-950">Notice:</strong> You have <strong>{unansweredCount}</strong> unanswered question(s). Unanswered questions will receive 0 points.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full min-h-[40px] px-4 font-mono text-xs uppercase tracking-wider"
          >
            Keep Reviewing
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="rounded-full min-h-[40px] px-5 bg-ink text-on-ink hover:bg-ink/90 font-mono text-xs uppercase tracking-wider font-bold"
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
