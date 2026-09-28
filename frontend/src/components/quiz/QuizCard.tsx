import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { QuizQuestion } from '@/types';
import Card from '@/components/ui/Card';
import { Flag, Award } from 'lucide-react';

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  disabled?: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  selectedOption,
  onSelectOption,
  isFlagged = false,
  onToggleFlag,
  disabled = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Card
      id={`question-card-${questionIndex}`}
      className={`border border-border-warm p-6 sm:p-8 space-y-6 bg-surface rounded-2xl shadow-none transition-all ${
        disabled ? 'opacity-70' : ''
      } ${isFlagged ? 'border-rose-500/60 ring-1 ring-rose-500/60' : ''}`}
    >
      {/* Question Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-warm pb-4">
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 bg-ink text-on-ink flex items-center justify-center font-mono font-bold text-xs shrink-0 rounded-lg">
            {String(questionIndex + 1).padStart(2, '0')}
          </span>
          {question.competency && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-azure-900 bg-azure-500/10 px-3 py-1 border border-azure-500/25 rounded-full">
              <Award className="h-3 w-3 text-azure-700" />
              <span>{question.competency}</span>
            </span>
          )}
        </div>

        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            disabled={disabled}
            className={`inline-flex items-center gap-2 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
              isFlagged
                ? 'bg-rose-500/15 text-rose-900 border-rose-500/40'
                : 'bg-surface-light hover:bg-surface-elevated text-ink-muted border-border-warm'
            }`}
          >
            <Flag className={`h-3.5 w-3.5 ${isFlagged ? 'text-rose-600 fill-rose-600' : 'text-ink-muted'}`} />
            <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
          </button>
        )}
      </div>

      {/* Question Text */}
      <h2 className="font-sans text-lg sm:text-xl font-bold text-ink leading-snug tracking-tight">
        {question.question}
      </h2>

      {/* Answer Options Grid */}
      <div className="space-y-3 pt-1">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const letter = OPTION_LETTERS[idx] || String.fromCharCode(65 + idx);

          return (
            <motion.label
              key={idx}
              whileHover={shouldReduceMotion || disabled ? {} : { x: 2 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 ${
                disabled
                  ? 'border-border-warm/60 bg-surface/50 text-ink-muted cursor-not-allowed'
                  : isSelected
                  ? 'border-ink bg-ink text-on-ink font-semibold shadow-xs cursor-pointer'
                  : 'border-border-warm bg-surface-light hover:border-ink/20 hover:bg-surface-elevated text-ink cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                aria-label={option}
                checked={isSelected}
                onChange={() => !disabled && onSelectOption(idx)}
                disabled={disabled}
                className="h-4 w-4 text-ink focus:ring-ink accent-ink disabled:cursor-not-allowed"
              />
              <span
                aria-hidden="true"
                className={`h-6 w-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-white/20 text-on-ink'
                    : 'bg-surface text-ink-muted border border-border-warm'
                }`}
              >
                {letter}
              </span>
              <span className={`text-sm font-sans leading-relaxed ${isSelected ? 'text-on-ink font-medium' : 'text-ink font-normal'}`}>
                {option}
              </span>
            </motion.label>
          );
        })}
      </div>
    </Card>
  );
};

export default QuizCard;
