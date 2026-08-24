import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-slate-500">
        <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
        <span className="text-[11px] font-bold uppercase tracking-wider block">
          Quick Questions / Prompt Starters:
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((suggestion, idx) => (
          <motion.button
            key={idx}
            type="button"
            whileHover={shouldReduceMotion || disabled ? {} : { scale: 1.03, y: -1 }}
            whileTap={shouldReduceMotion || disabled ? {} : { scale: 0.96 }}
            onClick={() => onSelectPrompt(suggestion)}
            disabled={disabled}
            className="text-xs text-left px-3.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-civic-600 hover:bg-civic-50/50 hover:text-civic-900 text-slate-700 rounded-full transition-colors duration-150 shadow-civic-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickPromptGrid;
