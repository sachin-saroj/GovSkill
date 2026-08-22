import React from 'react';
import { QuizQuestion } from '@/types';
import Card from '@/components/ui/Card';

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  disabled?: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  selectedOption,
  onSelectOption,
  disabled = false,
}) => {
  return (
    <Card
      className={`border-slate-200 shadow-civic-sm p-6 space-y-4 bg-white transition-all ${
        disabled ? 'opacity-70' : ''
      }`}
    >
      {/* Question Header */}
      <div className="flex items-start gap-3">
        <span className="h-7 w-7 rounded-lg bg-civic-100 text-civic-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          {questionIndex + 1}
        </span>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
          {question.question}
        </h3>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2.5 pt-1 pl-0 sm:pl-10">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const letter = OPTION_LETTERS[idx] || String.fromCharCode(65 + idx);

          return (
            <label
              key={idx}
              className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-150 shadow-civic-xs ${
                disabled
                  ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                  : isSelected
                  ? 'border-civic-700 bg-civic-50/70 text-civic-950 ring-2 ring-civic-700/20 font-semibold cursor-pointer'
                  : 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 text-slate-800 cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                aria-label={option}
                checked={isSelected}
                onChange={() => !disabled && onSelectOption(idx)}
                disabled={disabled}
                className="h-4 w-4 text-civic-700 focus:ring-civic-700 disabled:cursor-not-allowed"
              />
              <span
                aria-hidden="true"
                className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-civic-800 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {letter}
              </span>
              <span className="text-xs sm:text-sm font-medium leading-relaxed">
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </Card>
  );
};

export default QuizCard;
