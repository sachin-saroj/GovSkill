import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickPromptGridProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickPromptGrid: React.FC<QuickPromptGridProps> = ({
  prompts,
  onSelectPrompt,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-[#6B6357]">
        <Sparkles className="h-3.5 w-3.5 text-[#C9A24A]" />
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] block text-[#6B6357]">
          Quick Questions / Prompt Starters:
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(suggestion)}
            disabled={disabled}
            className="text-caption text-left px-4 py-2 bg-[#F5EFE0] border border-[#D9CFBB] hover:border-[#0A0A0A] hover:bg-[#FAF6ED] text-[#0A0A0A] rounded-full transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPromptGrid;
