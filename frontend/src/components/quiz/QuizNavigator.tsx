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
    <div className="bg-surface p-5 rounded-2xl border border-border-warm space-y-4 shadow-none">
      {/* Navigator Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-sans font-bold text-ink uppercase tracking-wider">Question Navigator:</span>
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-500/15 text-sage-900 border border-sage-500/30 font-bold uppercase">
            <CheckCircle2 className="h-3.5 w-3.5 text-sage-700" />
            <span>{answeredCount} Answered</span>
          </span>
          {unansweredCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light text-ink-muted border border-border-warm uppercase">
              <AlertCircle className="h-3.5 w-3.5 text-ink-muted" />
              <span>{unansweredCount} Unanswered</span>
            </span>
          )}
          {flaggedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-900 border border-rose-500/30 font-bold uppercase">
              <Flag className="h-3.5 w-3.5 text-rose-600 fill-rose-600" />
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

          let btnClass = 'bg-surface-light text-ink-muted hover:bg-surface-elevated hover:text-ink border-border-warm';
          if (isFlagged) {
            btnClass = 'bg-rose-500/15 text-rose-900 border-rose-500/40 font-bold ring-1 ring-rose-500/30';
          } else if (isAnswered) {
            btnClass = 'bg-ink text-on-ink border-ink font-bold shadow-xs';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJumpToQuestion(idx)}
              disabled={disabled}
              className={`h-8 min-w-[38px] px-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ink ${btnClass}`}
              title={`Jump to Question ${idx + 1}${isFlagged ? ' (Flagged)' : ''}${isAnswered ? ' (Answered)' : ''}`}
            >
              <span>{String(idx + 1).padStart(2, '0')}</span>
              {isFlagged && <Flag className="h-2.5 w-2.5 fill-current shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizNavigator;
