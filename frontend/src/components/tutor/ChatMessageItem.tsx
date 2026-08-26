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
          className={`h-8 w-8 rounded-civic-md flex items-center justify-center shrink-0 shadow-civic-xs mt-0.5 ${
            isOutOfScope ? 'bg-amber-700 text-white' : 'bg-civic-800 text-white'
          }`}
        >
          {isOutOfScope ? <AlertTriangle className="h-4 w-4 text-amber-200" /> : <Bot className="h-4 w-4 text-saffron-400" />}
        </div>
      )}

      <div
        className={`max-w-[90%] sm:max-w-[85%] rounded-civic-xl px-5 py-4 text-body leading-relaxed shadow-civic-xs transition-all space-y-3 ${
          isUser
            ? 'bg-civic-900 text-white rounded-br-none'
            : isOutOfScope
            ? 'bg-amber-50/90 border border-amber-300 text-slate-900 rounded-bl-none'
            : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
        }`}
      >
        {/* Source Reference & Grounding Status Strip */}
        {!isUser && msg.matched_module_title && (
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Grounding Status Pill */}
              {isOutOfScope ? (
                <span className="inline-flex items-center gap-1 text-micro font-semibold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  <AlertTriangle className="h-3 w-3 text-amber-700" />
                  <span>Unverified / Out of Scope</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-micro font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>{isFallback ? 'Verified Training Guide' : 'Grounded Curriculum'}</span>
                </span>
              )}

              {/* Matched Module Name */}
              <span className="inline-flex items-center gap-1 text-micro font-semibold text-civic-800 bg-civic-50 px-2.5 py-0.5 rounded-civic-md border border-civic-200">
                <BookOpen className="h-3 w-3 text-civic-700" />
                <span className="truncate max-w-[180px]">{msg.matched_module_title}</span>
              </span>
            </div>

            {matchedModule && (
              <Link
                to={`/module?id=${matchedModule.id}`}
                className="inline-flex items-center gap-1 text-caption font-semibold text-civic-700 hover:text-civic-900 hover:underline"
              >
                <span>Open Lesson</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}

        {/* Source Sections Tags */}
        {!isUser && msg.source_sections && msg.source_sections.length > 0 && !isOutOfScope && (
          <div className="flex flex-wrap items-center gap-1 text-caption text-slate-500">
            <span className="font-semibold text-slate-600">Sections:</span>
            {msg.source_sections.map((sec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-civic-sm bg-slate-100 text-slate-700 font-medium border border-slate-200 text-micro"
              >
                {sec}
              </span>
            ))}
          </div>
        )}

        {/* Message Content Body */}
        <div className="whitespace-pre-line leading-relaxed font-normal text-slate-800">
          {msg.text}
        </div>

        {/* Quick Action Mode Chips (for tutor messages) */}
        {!isUser && !isOutOfScope && msg.matched_module_title && onSelectModeAction && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-micro font-semibold uppercase tracking-wider text-slate-400 mr-1">
              Actions:
            </span>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'simple')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-civic-md bg-slate-50 hover:bg-civic-50 text-slate-700 hover:text-civic-900 border border-slate-200 text-caption font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <HelpCircle className="h-3.5 w-3.5 text-civic-700" />
              <span>Explain simpler</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'procedure')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-civic-md bg-slate-50 hover:bg-civic-50 text-slate-700 hover:text-civic-900 border border-slate-200 text-caption font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <ListOrdered className="h-3.5 w-3.5 text-civic-700" />
              <span>Give procedure</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'pitfalls')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-civic-md bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 text-caption font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <AlertOctagon className="h-3.5 w-3.5 text-amber-600" />
              <span>What to avoid</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectModeAction(msg.text, 'example')}
              disabled={disabled}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-civic-md bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 text-caption font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
              <span>Workplace scenario</span>
            </button>
          </div>
        )}

        {/* Suggested Follow-up Pills */}
        {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && onSelectFollowup && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-micro font-semibold uppercase tracking-wider text-slate-400 block">
              Suggested Follow-ups:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {msg.suggested_followups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup(followup)}
                  disabled={disabled}
                  className="text-left text-caption px-3 py-1.5 rounded-civic-md bg-civic-50/70 hover:bg-civic-100 text-civic-900 border border-civic-200/80 transition-all font-medium cursor-pointer disabled:opacity-50"
                >
                  💬 {followup}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span
          className={`block text-caption pt-1 font-mono ${
            isUser ? 'text-slate-300 text-right' : 'text-slate-400'
          }`}
        >
          {msg.timestamp}
        </span>
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-civic-md bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-civic-xs mt-0.5">
          <User className="h-4 w-4 text-slate-200" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
