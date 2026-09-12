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
      className={`border-[#D9CFBB] p-6 sm:p-7 space-y-5 bg-[#EDE4D0] rounded-2xl transition-all ${
        disabled ? 'opacity-70' : ''
      } ${isFlagged ? 'ring-2 ring-[#C97B5A]/60 border-[#C97B5A]' : ''}`}
    >
      {/* Question Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9CFBB] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-full bg-[#0A0A0A] text-[#F5EFE0] flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
            {questionIndex + 1}
          </span>
          {question.competency && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#6B6357] bg-[#F5EFE0] px-2.5 py-0.5 rounded-full border border-[#D9CFBB]">
              <Award className="h-3 w-3 text-[#2A5B4A]" />
              <span>{question.competency}</span>
            </span>
          )}
        </div>

        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            disabled={disabled}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border transition-all cursor-pointer ${
              isFlagged
                ? 'bg-[#F5EFE0] text-[#C97B5A] border-[#C97B5A] font-semibold'
                : 'bg-[#F5EFE0] hover:bg-[#F5EFE0]/80 text-[#6B6357] border-[#D9CFBB]'
            }`}
          >
            <Flag className={`h-3.5 w-3.5 ${isFlagged ? 'text-[#C97B5A] fill-[#C97B5A]' : 'text-[#6B6357]'}`} />
            <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
          </button>
        )}
      </div>

      {/* Question Text */}
      <h3 className="font-serif text-lg sm:text-xl font-normal text-[#0A0A0A] leading-snug tracking-tight">
        {question.question}
      </h3>

      {/* Answer Options Grid */}
      <div className="space-y-2.5 pt-1">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const letter = OPTION_LETTERS[idx] || String.fromCharCode(65 + idx);

          return (
            <motion.label
              key={idx}
              whileHover={shouldReduceMotion || disabled ? {} : { scale: 1.003, x: 2 }}
              whileTap={shouldReduceMotion || disabled ? {} : { scale: 0.997 }}
              className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-150 ${
                disabled
                  ? 'border-[#D9CFBB] bg-[#F5EFE0]/50 text-[#6B6357] cursor-not-allowed'
                  : isSelected
                  ? 'border-[#0A0A0A] bg-[#F5EFE0] text-[#0A0A0A] ring-1 ring-[#0A0A0A] font-semibold cursor-pointer shadow-xs'
                  : 'border-[#D9CFBB] bg-[#F5EFE0] hover:border-[#0A0A0A]/60 text-[#0A0A0A] cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                aria-label={option}
                checked={isSelected}
                onChange={() => !disabled && onSelectOption(idx)}
                disabled={disabled}
                className="h-4 w-4 text-[#0A0A0A] focus:ring-[#0A0A0A] accent-[#0A0A0A] disabled:cursor-not-allowed"
              />
              <span
                aria-hidden="true"
                className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-[#F5EFE0]'
                    : 'bg-[#EDE4D0] text-[#6B6357] border border-[#D9CFBB]'
                }`}
              >
                {letter}
              </span>
              <span className="text-sm font-sans font-normal leading-relaxed">
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
