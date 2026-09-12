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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#EDE4D0] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#D9CFBB] space-y-5 animate-scale-in">
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div
            className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 border ${
              hasUnanswered ? 'bg-[#F5EFE0] text-[#C97B5A] border-[#C97B5A]/40' : 'bg-[#F5EFE0] text-[#2A5B4A] border-[#2A5B4A]/40'
            }`}
          >
            {hasUnanswered ? (
              <AlertTriangle className="h-6 w-6 text-[#C97B5A]" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-[#2A5B4A]" />
            )}
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-[#0A0A0A] leading-snug tracking-tight">
              Confirm Assessment Submission
            </h3>
            <p className="text-xs text-[#6B6357]">
              Your answers will be evaluated server-side for official competency scoring.
            </p>
          </div>
        </div>

        {/* Assessment Status Summary Box */}
        <div className="bg-[#F5EFE0] p-4 sm:p-5 rounded-xl border border-[#D9CFBB] space-y-2.5 text-xs font-mono">
          <div className="flex justify-between items-center text-[#6B6357]">
            <span>Total Questions:</span>
            <span className="font-bold text-[#0A0A0A]">{totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center text-[#6B6357]">
            <span>Answered:</span>
            <span className="font-bold text-[#2A5B4A]">
              {answeredCount} of {totalQuestions}
            </span>
          </div>

          {flaggedCount > 0 && (
            <div className="flex justify-between items-center text-[#C97B5A] bg-[#EDE4D0] px-3.5 py-1.5 rounded-full border border-[#C97B5A]/40">
              <span className="inline-flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5 text-[#C97B5A] fill-[#C97B5A]" />
                <span>Flagged for Review:</span>
              </span>
              <span className="font-bold">{flaggedCount}</span>
            </div>
          )}

          {hasUnanswered && (
            <div className="p-3.5 rounded-xl bg-[#EDE4D0] border border-[#C97B5A]/40 text-[#0A0A0A] flex items-start gap-2 font-sans">
              <AlertTriangle className="h-4 w-4 text-[#C97B5A] shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-normal text-[#0A0A0A]">
                <strong className="font-semibold text-[#C97B5A]">Notice:</strong> You have <strong>{unansweredCount}</strong> unanswered question(s). Unanswered questions will receive 0 points.
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
            className="rounded-full"
          >
            Keep Reviewing
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="rounded-full"
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
