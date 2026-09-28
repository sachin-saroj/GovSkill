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
      <div className="flex items-center gap-2 text-ink-muted">
        <Sparkles className="h-3.5 w-3.5 text-azure-700" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] block text-ink-muted">
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
            className="text-caption text-left px-4 py-2.5 bg-surface-light border border-border-warm hover:border-ink/30 hover:bg-surface-elevated text-ink rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-mono text-xs font-semibold shadow-none"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPromptGrid;
