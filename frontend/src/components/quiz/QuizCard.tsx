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
      className={`border-[#E4E4E7] p-6 sm:p-8 space-y-6 bg-white rounded-none shadow-none transition-all ${
        disabled ? 'opacity-70' : ''
      } ${isFlagged ? 'border-[#EE8148] ring-1 ring-[#EE8148]' : ''}`}
    >
      {/* Question Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E4E7] pb-4">
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 bg-black text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
            {String(questionIndex + 1).padStart(2, '0')}
          </span>
          {question.competency && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#0E50B0] bg-[#0E50B0]/5 px-3 py-1 border border-[#0E50B0]/20">
              <Award className="h-3 w-3 text-[#0E50B0]" />
              <span>{question.competency}</span>
            </span>
          )}
        </div>

        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            disabled={disabled}
            className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-none border transition-all cursor-pointer ${
              isFlagged
                ? 'bg-orange-50 text-[#AF411E] border-[#EE8148]'
                : 'bg-white hover:bg-zinc-50 text-[#71717A] border-[#E4E4E7]'
            }`}
          >
            <Flag className={`h-3.5 w-3.5 ${isFlagged ? 'text-[#AF411E] fill-[#AF411E]' : 'text-[#71717A]'}`} />
            <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
          </button>
        )}
      </div>

      {/* Question Text */}
      <h2 className="font-sans text-lg sm:text-xl font-bold text-black leading-snug tracking-tight">
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
              className={`flex items-center gap-4 p-4 rounded-none border transition-all duration-150 ${
                disabled
                  ? 'border-[#E4E4E7] bg-zinc-50 text-[#71717A] cursor-not-allowed'
                  : isSelected
                  ? 'border-black bg-zinc-50 text-black font-bold ring-1 ring-black cursor-pointer'
                  : 'border-[#E4E4E7] bg-white hover:border-black/50 text-black cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                aria-label={option}
                checked={isSelected}
                onChange={() => !disabled && onSelectOption(idx)}
                disabled={disabled}
                className="h-4 w-4 text-black focus:ring-black accent-black disabled:cursor-not-allowed"
              />
              <span
                aria-hidden="true"
                className={`h-6 w-6 rounded-none flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 text-[#71717A] border border-[#E4E4E7]'
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
