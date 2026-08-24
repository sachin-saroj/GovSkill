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
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-civic-xs space-y-3">
      {/* Navigator Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-900">Question Navigator:</span>
        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>{answeredCount} Answered</span>
          </span>
          {unansweredCount > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              <span>{unansweredCount} Unanswered</span>
            </span>
          )}
          {flaggedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
              <Flag className="h-3 w-3 text-amber-700 fill-amber-700" />
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

          let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
          if (isFlagged) {
            btnClass = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
          } else if (isAnswered) {
            btnClass = 'bg-civic-900 text-white border-civic-900 font-bold shadow-civic-xs';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJumpToQuestion(idx)}
              disabled={disabled}
              className={`h-8 min-w-[32px] px-2 rounded-lg border text-xs flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 ${btnClass}`}
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
