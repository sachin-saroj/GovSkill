import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Module } from '@/types';
import { Bot, User, Tag, ArrowRight } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  matched_module_title?: string;
  timestamp: string;
}

interface ChatMessageItemProps {
  msg: ChatMessage;
  matchedModule?: Module | null;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  matchedModule,
}) => {
  const isUser = msg.sender === 'user';
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-civic-800 text-white flex items-center justify-center shrink-0 shadow-civic-xs mt-0.5">
          <Bot className="h-4 w-4 text-saffron-400" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-civic-xs transition-all ${
          isUser
            ? 'bg-civic-900 text-white rounded-br-none'
            : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
        }`}
      >
        {/* Source Lesson Reference Card */}
        {msg.matched_module_title && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-civic-800 bg-civic-50 px-2.5 py-0.5 rounded-full border border-civic-200">
              <Tag className="h-3 w-3 text-civic-700" />
              <span>Source: {msg.matched_module_title}</span>
            </div>

            {matchedModule && (
              <Link
                to={`/module?id=${matchedModule.id}`}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-civic-700 hover:text-civic-900 hover:underline"
              >
                <span>Open Lesson</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}

        <p className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</p>

        <span
          className={`block text-[10px] mt-1.5 font-mono ${
            isUser ? 'text-slate-300 text-right' : 'text-slate-400'
          }`}
        >
          {msg.timestamp}
        </span>
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-civic-xs mt-0.5">
          <User className="h-4 w-4 text-slate-200" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
