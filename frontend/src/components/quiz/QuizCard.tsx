import React from 'react';
import { QuizQuestion } from '@/types';

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  disabled?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  selectedOption,
  onSelectOption,
  disabled = false,
}) => {
  return (
    <div className={`rounded-xl border border-[#E2E6EB] bg-white p-6 shadow-sm mb-4 ${disabled ? 'opacity-70' : ''}`}>
      <h3 className="text-lg font-semibold text-[#1A1F2B] mb-4">
        {questionIndex + 1}. {question.question}
      </h3>
      <div className="space-y-2">
        {question.options.map((option, idx) => (
          <label
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              disabled
                ? 'border-[#E2E6EB] bg-gray-50 text-[#5A6472] cursor-not-allowed'
                : selectedOption === idx
                ? 'border-[#1E4D8C] bg-[#1E4D8C]/5 text-[#1E4D8C] cursor-pointer'
                : 'border-[#E2E6EB] bg-white hover:bg-gray-50 text-[#1A1F2B] cursor-pointer'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedOption === idx}
              onChange={() => !disabled && onSelectOption(idx)}
              disabled={disabled}
              className="h-4 w-4 text-[#1E4D8C] focus:ring-[#1E4D8C] disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
export default QuizCard;
