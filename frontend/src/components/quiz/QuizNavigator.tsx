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
    <div className="bg-white p-5 rounded-none border border-[#E4E4E7] space-y-4 shadow-none">
      {/* Navigator Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-sans font-bold text-black uppercase tracking-wider">Question Navigator:</span>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold uppercase">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{answeredCount} Answered</span>
          </span>
          {unansweredCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[#71717A] uppercase">
              <AlertCircle className="h-3.5 w-3.5 text-[#71717A]" />
              <span>{unansweredCount} Unanswered</span>
            </span>
          )}
          {flaggedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[#AF411E] font-bold uppercase">
              <Flag className="h-3.5 w-3.5 text-[#EE8148] fill-[#EE8148]" />
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

          let btnClass = 'bg-white text-[#71717A] hover:bg-zinc-50 border-[#E4E4E7]';
          if (isFlagged) {
            btnClass = 'bg-orange-50 text-[#AF411E] border-[#EE8148] font-bold';
          } else if (isAnswered) {
            btnClass = 'bg-black text-white border-black font-bold';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJumpToQuestion(idx)}
              disabled={disabled}
              className={`h-8 min-w-[36px] px-2.5 rounded-none border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${btnClass}`}
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
