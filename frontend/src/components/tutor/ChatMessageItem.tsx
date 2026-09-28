import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Module } from '@/types';
import {
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  ListOrdered,
  AlertOctagon,
  BookOpen,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  matched_module_title?: string;
  grounding_status?: 'grounded' | 'insufficient_context' | 'fallback';
  suggested_followups?: string[];
  source_sections?: string[];
  mode?: string;
  timestamp: string;
}

interface ChatMessageItemProps {
  msg: ChatMessage;
  matchedModule?: Module | null;
  onSelectFollowup?: (prompt: string) => void;
  onSelectModeAction?: (promptText: string, mode: string) => void;
  disabled?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  matchedModule,
  onSelectFollowup,
  onSelectModeAction,
  disabled = false,
}) => {
  const isUser = msg.sender === 'user';
  const shouldReduceMotion = useReducedMotion();
  const isOutOfScope = msg.grounding_status === 'insufficient_context';
  const isFallback = msg.grounding_status === 'fallback';


  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
            isOutOfScope ? 'bg-rose-500/20 text-rose-900 border-rose-500/40' : 'bg-surface text-ink border-border-warm shadow-xs'
          }`}
        >
          {isOutOfScope ? <AlertTriangle className="h-4 w-4 text-rose-700" /> : <Bot className="h-4 w-4 text-azure-700" />}
        </div>
      )}

      <div
        className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-5 py-4 text-body leading-relaxed transition-all space-y-3 ${
          isUser
            ? 'bg-ink text-on-ink font-sans rounded-tr-xs shadow-xs'
            : isOutOfScope
            ? 'bg-rose-500/10 border border-rose-500/30 text-ink font-sans rounded-tl-xs shadow-none'
            : 'bg-surface-light border border-border-warm text-ink font-sans rounded-tl-xs shadow-none'
        }`}
      >
        {/* Source Reference & Grounding Status Strip */}
        {!isUser && msg.matched_module_title && (
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-warm">
            <div className="flex flex-wrap items-center gap-2">
              {/* Grounding Status Pill */}
              {isOutOfScope ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-900 bg-rose-500/15 px-2.5 py-1 border border-rose-500/30 rounded-full">
                  <AlertTriangle className="h-3 w-3 text-rose-700" />
                  <span>Unverified / Out of Scope</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-sage-900 bg-sage-500/15 px-2.5 py-1 border border-sage-500/30 rounded-full">
                  <ShieldCheck className="h-3 w-3 text-sage-700" />
                  <span>{isFallback ? 'Verified Training Guide' : 'Grounded Curriculum'}</span>
                </span>
              )}

              {/* Matched Module Name */}
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-ink bg-surface px-2.5 py-1 border border-border-warm rounded-full">
                <BookOpen className="h-3 w-3 text-azure-700" />
                <span className="truncate max-w-[200px]">{msg.matched_module_title}</span>
              </span>
            </div>

            {matchedModule && (
              <Link
                to={`/module?id=${matchedModule.id}`}
                className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase text-ink hover:text-ink-muted transition-colors rounded-full px-2 py-0.5"
              >
                <span>Open Lesson</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}

        {/* Source Sections Tags */}
        {!isUser && msg.source_sections && msg.source_sections.length > 0 && !isOutOfScope && (
          <div className="flex flex-wrap items-center gap-1.5 text-caption text-ink-muted font-mono text-[11px]">
            <span className="font-bold text-ink uppercase">Source sections:</span>
            {msg.source_sections.map((sec, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-surface text-ink font-medium border border-border-warm rounded-full text-[10px]"
              >
                {sec}
              </span>
            ))}
          </div>
        )}

        {/* Message Content Body */}
        <div className={`whitespace-pre-line leading-relaxed ${isUser ? 'text-on-ink' : 'text-ink'} text-body font-normal`}>
          {msg.text}
        </div>

        {/* Quick Action Mode Chips (for tutor messages) */}
        {!isUser && !isOutOfScope && msg.matched_module_title && onSelectModeAction && (
          <div className="pt-2 border-t border-border-warm flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted mr-1">
              Actions:
            </span>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'simple')}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-elevated text-ink border border-border-warm rounded-full text-caption font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <HelpCircle className="h-3.5 w-3.5 text-azure-700" />
              <span>Explain simpler</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'procedure')}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-elevated text-ink border border-border-warm rounded-full text-caption font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <ListOrdered className="h-3.5 w-3.5 text-azure-700" />
              <span>Give procedure</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'pitfalls')}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-elevated text-ink border border-border-warm rounded-full text-caption font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <AlertOctagon className="h-3.5 w-3.5 text-rose-600" />
              <span>What to avoid</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'example')}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-elevated text-ink border border-border-warm rounded-full text-caption font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="h-3.5 w-3.5 text-sage-700" />
              <span>Workplace scenario</span>
            </button>
          </div>
        )}

        {/* Suggested Follow-up Pills */}
        {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && onSelectFollowup && (
          <div className="pt-2 border-t border-border-warm space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              Suggested Follow-ups:
            </span>
            <div className="flex flex-wrap gap-2">
              {msg.suggested_followups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup(followup)}
                  disabled={disabled}
                  className="text-left text-caption px-3.5 py-1.5 bg-surface hover:bg-surface-elevated text-ink border border-border-warm rounded-full transition-all font-mono text-xs cursor-pointer disabled:opacity-50"
                >
                  💬 {followup}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span
          className={`block text-[10px] pt-1 font-mono uppercase tracking-wider ${
            isUser ? 'text-[#FAF4E4]/70 text-right' : 'text-ink-muted'
          }`}
        >
          {msg.timestamp}
        </span>
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-ink text-on-ink flex items-center justify-center shrink-0 mt-0.5 border border-border-warm/40 shadow-xs">
          <User className="h-4 w-4 text-on-ink" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
