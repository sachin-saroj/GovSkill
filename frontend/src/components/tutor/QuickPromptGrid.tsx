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
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[#71717A]">
        <Sparkles className="h-3.5 w-3.5 text-[#0E50B0]" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] block text-[#71717A]">
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
            className="text-caption text-left px-4 py-2.5 bg-white border border-[#E4E4E7] hover:border-black hover:bg-zinc-50 text-black rounded-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-mono text-xs font-semibold"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPromptGrid;
