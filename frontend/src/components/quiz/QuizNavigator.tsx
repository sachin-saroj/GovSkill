import React from 'react';
import { QuizQuestion } from '@/types';
import { Flag, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuizNavigatorProps {
  questions: QuizQuestion[];
  answers: Record<string, number>;
  flaggedQuestions: Record<string, boolean>;
  onJumpToQuestion: (index: number) => void;
  disabled?: boolean;
}

export const QuizNavigator: React.FC<QuizNavigatorProps> = ({
  questions,
  answers,
  flaggedQuestions,
  onJumpToQuestion,
  disabled = false,
}) => {
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="bg-[#EDE4D0] p-4 sm:p-5 rounded-2xl border border-[#D9CFBB] space-y-3.5 shadow-xs">
      {/* Navigator Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-serif font-semibold text-[#0A0A0A] tracking-tight">Question Navigator:</span>
        <div className="flex items-center gap-3 text-xs text-[#6B6357] font-mono">
          <span className="inline-flex items-center gap-1 text-[#2A5B4A]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#2A5B4A]" />
            <span>{answeredCount} Answered</span>
          </span>
          {unansweredCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[#6B6357]">
              <AlertCircle className="h-3.5 w-3.5 text-[#6B6357]" />
              <span>{unansweredCount} Unanswered</span>
            </span>
          )}
          {flaggedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[#C97B5A] font-semibold">
              <Flag className="h-3.5 w-3.5 text-[#C97B5A] fill-[#C97B5A]" />
              <span>{flaggedCount} Flagged</span>
            </span>
          )}
        </div>
      </div>

      {/* Number Buttons Palette */}
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isFlagged = Boolean(flaggedQuestions[q.id]);

          let btnClass = 'bg-[#F5EFE0] text-[#6B6357] hover:bg-[#F5EFE0]/80 border-[#D9CFBB]';
          if (isFlagged) {
            btnClass = 'bg-[#F5EFE0] text-[#C97B5A] border-[#C97B5A] font-semibold';
          } else if (isAnswered) {
            btnClass = 'bg-[#0A0A0A] text-[#F5EFE0] border-[#0A0A0A] font-semibold shadow-xs';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJumpToQuestion(idx)}
              disabled={disabled}
              className={`h-8 min-w-[32px] px-2 rounded-full border text-xs font-mono flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 ${btnClass}`}
              title={`Jump to Question ${idx + 1}${isFlagged ? ' (Flagged)' : ''}${isAnswered ? ' (Answered)' : ''}`}
            >
              <span>{idx + 1}</span>
              {isFlagged && <Flag className="h-2.5 w-2.5 fill-current shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizNavigator;
