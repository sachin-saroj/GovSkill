import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import api from '@/lib/api';
import { Module, TutorAskResponse } from '@/types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ChatMessageItem, { ChatMessage } from '@/components/tutor/ChatMessageItem';
import QuickPromptGrid from '@/components/tutor/QuickPromptGrid';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  BookOpen,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

const PROMPT_SUGGESTIONS = [
  'What are the mandatory verification rules for Income Certificates?',
  'What are the portal SLA guidelines and supervisor escalation timeline?',
  'How should citizen PII and government workstation credentials be protected?',
  'What is the record retention policy for income certificates vs land records?',
];

export const TutorChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [modules, setModules] = useState<Module[]>([]);
  const initialModuleId = searchParams.get('module') || searchParams.get('moduleId') || 'auto';
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: "Hello! I am your official Government Training Copilot. Ask me any question regarding document verification, portal workflows, cybersecurity standards, or record retention. All answers are strictly grounded in approved curriculum.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grounding_status: 'grounded',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [lastFailedQuestion, setLastFailedQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const promptSentRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get<Module[]>('/modules');
        setModules(res.data);
      } catch {
        console.warn('Failed to load modules list for tutor dropdown');
      }
    };
    fetchModules();

    const incomingPrompt = searchParams.get('prompt') || searchParams.get('question');
    if (incomingPrompt && !promptSentRef.current) {
      promptSentRef.current = true;
      sendQuestionText(incomingPrompt);
    }
  }, []);

  const sendQuestionText = async (questionText: string, mode: string = 'standard') => {
    if (!questionText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setError(null);
    setLastFailedQuestion(null);
    setIsLoading(true);

    try {
      const res = await api.post<TutorAskResponse>('/tutor/ask', {
        module_id: selectedModuleId,
        question: questionText.trim(),
        mode: mode,
      });

      const tutorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: res.data.answer,
        matched_module_title: res.data.matched_module_title,
        grounding_status: res.data.grounding_status,
        suggested_followups: res.data.suggested_followups,
        source_sections: res.data.source_sections,
        mode: res.data.mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      const msg = err.response?.data?.detail?.error?.message || 'Failed to get answer from Training Copilot';
      setError(msg);
      setLastFailedQuestion(questionText.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestionText(inputQuestion);
  };

  const handleSelectModeAction = (_previousAnswer: string, mode: string) => {
    let modeQuery = '';
    if (mode === 'simple') {
      modeQuery = 'Can you explain this simpler in plain language?';
    } else if (mode === 'procedure') {
      modeQuery = 'What is the exact sequential procedure for this?';
    } else if (mode === 'pitfalls') {
      modeQuery = 'What specific mistakes and red flags should I avoid here?';
    } else {
      modeQuery = 'Can you provide further guidance on this?';
    }
    sendQuestionText(modeQuery, mode);
  };

  const handleRetryLast = () => {
    if (lastFailedQuestion) {
      sendQuestionText(lastFailedQuestion);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'tutor',
        text: "Hello! I am your official Government Training Copilot. Ask me any question regarding document verification, portal workflows, cybersecurity standards, or record retention. All answers are strictly grounded in approved curriculum.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounding_status: 'grounded',
      },
    ]);
    setError(null);
    setLastFailedQuestion(null);
    setInputQuestion('');
  };

  const findModuleByTitle = (title?: string) => {
    if (!title) return null;
    return modules.find((m) => m.title.toLowerCase().trim() === title.toLowerCase().trim());
  };

  const activeModuleTitle = selectedModuleId === 'auto'
    ? 'Auto-Detecting Relevant Module'
    : (modules.find((m) => m.id === selectedModuleId)?.title || 'Selected Module');

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6"
    >
      {/* Header Banner */}
      <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-civic-800 font-bold text-xs">
            <Sparkles className="h-4 w-4 text-saffron-500" />
            <span>Government Training Copilot</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrative Assistant & Copilot
          </h1>
          <p className="text-xs text-slate-500">
            Answers are strictly grounded in approved government training modules with zero policy fabrication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Module Scope Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 shrink-0 shadow-civic-xs">
            <BookOpen className="h-4 w-4 text-civic-700" />
            <label htmlFor="context-select" className="text-xs font-bold text-slate-600">
              Scope:
            </label>
            <select
              id="context-select"
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              disabled={isLoading}
              className="text-xs font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="auto">Auto-Detect Relevant Module ✨</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.title}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            onClick={handleResetChat}
            title="Reset conversation"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-civic-xs cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Active Scope Pill */}
      <motion.div variants={fadeUpVariants} className="flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 shadow-civic-xs">

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>
            <strong>Active Copilot Scope:</strong> {activeModuleTitle}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Anti-hallucination verified
        </span>
      </motion.div>

      {/* Error Alert with AnimatePresence */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-300 text-xs text-red-700 flex items-center justify-between gap-2 shadow-civic-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            {lastFailedQuestion && (
              <button
                type="button"
                onClick={handleRetryLast}
                className="flex items-center gap-1 px-2.5 py-1 bg-white border border-red-300 text-red-800 rounded-lg font-bold hover:bg-red-50 text-[11px] cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Questions Grid */}
      <motion.div variants={fadeUpVariants}>
        <QuickPromptGrid
          prompts={PROMPT_SUGGESTIONS}
          onSelectPrompt={(p) => sendQuestionText(p)}
          disabled={isLoading}
        />
      </motion.div>

      {/* Chat Messages Workspace */}
      <motion.div variants={fadeUpVariants}>
        <Card className="min-h-[460px] flex flex-col justify-between p-6 bg-slate-50/50 border-slate-200 shadow-civic-sm rounded-3xl">
          <div className="space-y-4 overflow-y-auto max-h-[520px] pr-2 mb-4">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                msg={msg}
                matchedModule={findModuleByTitle(msg.matched_module_title)}
                onSelectFollowup={(f) => sendQuestionText(f)}
                onSelectModeAction={handleSelectModeAction}
                disabled={isLoading}
              />
            ))}

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: 6 }}
                  className="flex gap-3 items-center text-slate-600 text-xs"
                >
                  <div className="h-8 w-8 rounded-xl bg-civic-800 text-white flex items-center justify-center shadow-civic-xs">
                    <Bot className="h-4 w-4 text-saffron-400" />
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-civic-xs">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-civic-700" />
                    <span className="font-medium text-slate-700">
                      Verifying question against official training curriculum...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <form onSubmit={handleSendMessage} className="flex gap-2.5 pt-4 border-t border-slate-200 bg-white -mx-6 -mb-6 p-4 rounded-b-3xl">
            <Input
              placeholder="Ask about verification rules, SLA timelines, cybersecurity standards..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs sm:text-sm bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
            />
            <motion.div
              whileHover={shouldReduceMotion || isLoading || !inputQuestion.trim() ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion || isLoading || !inputQuestion.trim() ? {} : { scale: 0.97 }}
            >
              <Button
                type="submit"
                disabled={isLoading || !inputQuestion.trim()}
                className="px-5 shadow-civic-xs shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4 mr-1.5" />
                <span>Send</span>
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TutorChatPage;
