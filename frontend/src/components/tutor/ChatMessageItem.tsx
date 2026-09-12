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
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
            isOutOfScope ? 'bg-[#C97B5A] text-white' : 'bg-[#0A0A0A] text-[#F5EFE0]'
          }`}
        >
          {isOutOfScope ? <AlertTriangle className="h-4 w-4 text-[#F5EFE0]" /> : <Bot className="h-4 w-4 text-[#C9A24A]" />}
        </div>
      )}

      <div
        className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-5 py-4 text-body leading-relaxed shadow-sm transition-all space-y-3 ${
          isUser
            ? 'bg-[#0A0A0A] text-[#F5EFE0] rounded-tr-sm font-sans'
            : isOutOfScope
            ? 'bg-[#C97B5A]/10 border border-[#C97B5A]/30 text-[#0A0A0A] rounded-tl-sm font-serif'
            : 'bg-[#EDE4D0] border border-[#D9CFBB] text-[#0A0A0A] rounded-tl-sm font-serif'
        }`}
      >
        {/* Source Reference & Grounding Status Strip */}
        {!isUser && msg.matched_module_title && (
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#D9CFBB]">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Grounding Status Pill */}
              {isOutOfScope ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#C97B5A] bg-[#C97B5A]/10 px-2.5 py-0.5 rounded-full border border-[#C97B5A]/30">
                  <AlertTriangle className="h-3 w-3 text-[#C97B5A]" />
                  <span>Unverified / Out of Scope</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#2A5B4A] bg-[#2A5B4A]/10 px-2.5 py-0.5 rounded-full border border-[#2A5B4A]/30">
                  <ShieldCheck className="h-3 w-3 text-[#2A5B4A]" />
                  <span>{isFallback ? 'Verified Training Guide' : 'Grounded Curriculum'}</span>
                </span>
              )}

              {/* Matched Module Name */}
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#0A0A0A] bg-[#E4D9C3] px-2.5 py-0.5 rounded-full border border-[#D9CFBB]">
                <BookOpen className="h-3 w-3 text-[#C9A24A]" />
                <span className="truncate max-w-[200px]">{msg.matched_module_title}</span>
              </span>
            </div>

            {matchedModule && (
              <Link
                to={`/module?id=${matchedModule.id}`}
                className="inline-flex items-center gap-1 text-caption font-medium text-[#0A0A0A] hover:text-[#C97B5A] transition-colors"
              >
                <span>Open Lesson</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}

        {/* Source Sections Tags */}
        {!isUser && msg.source_sections && msg.source_sections.length > 0 && !isOutOfScope && (
          <div className="flex flex-wrap items-center gap-1 text-caption text-[#6B6357] font-mono text-[11px]">
            <span className="font-semibold text-[#0A0A0A]">Source sections:</span>
            {msg.source_sections.map((sec, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-[#F5EFE0] text-[#0A0A0A] font-medium border border-[#D9CFBB] text-[10px]"
              >
                {sec}
              </span>
            ))}
          </div>
        )}

        {/* Message Content Body */}
        <div className={`whitespace-pre-line leading-relaxed ${isUser ? 'text-[#F5EFE0]' : 'text-[#0A0A0A]'} text-body`}>
          {msg.text}
        </div>

        {/* Quick Action Mode Chips (for tutor messages) */}
        {!isUser && !isOutOfScope && msg.matched_module_title && onSelectModeAction && (
          <div className="pt-2 border-t border-[#D9CFBB] flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6B6357] mr-1">
              Actions:
            </span>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'simple')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5EFE0] hover:bg-[#EFE6D2] text-[#0A0A0A] border border-[#D9CFBB] text-caption font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#C9A24A]" />
              <span>Explain simpler</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'procedure')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5EFE0] hover:bg-[#EFE6D2] text-[#0A0A0A] border border-[#D9CFBB] text-caption font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              <ListOrdered className="h-3.5 w-3.5 text-[#C9A24A]" />
              <span>Give procedure</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'pitfalls')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5EFE0] hover:bg-[#C97B5A]/10 text-[#0A0A0A] hover:text-[#C97B5A] border border-[#D9CFBB] text-caption font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              <AlertOctagon className="h-3.5 w-3.5 text-[#C97B5A]" />
              <span>What to avoid</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'example')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5EFE0] hover:bg-[#2A5B4A]/10 text-[#0A0A0A] hover:text-[#2A5B4A] border border-[#D9CFBB] text-caption font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#2A5B4A]" />
              <span>Workplace scenario</span>
            </button>
          </div>
        )}

        {/* Suggested Follow-up Pills */}
        {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && onSelectFollowup && (
          <div className="pt-2 border-t border-[#D9CFBB] space-y-1.5">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6B6357] block">
              Suggested Follow-ups:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {msg.suggested_followups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup(followup)}
                  disabled={disabled}
                  className="text-left text-caption px-3.5 py-1.5 rounded-full bg-[#F5EFE0] hover:bg-[#EFE6D2] text-[#0A0A0A] border border-[#D9CFBB] transition-all font-medium cursor-pointer disabled:opacity-50"
                >
                  💬 {followup}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span
          className={`block text-[11px] pt-1 font-mono ${
            isUser ? 'text-[#EDE4D0]/70 text-right' : 'text-[#6B6357]'
          }`}
        >
          {msg.timestamp}
        </span>
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-[#0A0A0A] text-[#F5EFE0] flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-[#D9CFBB]">
          <User className="h-4 w-4 text-[#F5EFE0]" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
