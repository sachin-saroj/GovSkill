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
  const incomingMode = searchParams.get('mode') || 'standard';
  const incomingCompetency = searchParams.get('competency') || null;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: incomingCompetency
        ? `Hello! I am your official Government Training Copilot. I've activated Targeted Remediation for "${incomingCompetency}". Review the guidance below or ask for specific examples, red flags, or practice checks.`
        : "Hello! I am your official Government Training Copilot. Ask me any question regarding document verification, portal workflows, cybersecurity standards, or record retention. All answers are strictly grounded in approved curriculum.",
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
      sendQuestionText(incomingPrompt, incomingMode);
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
      className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* 1. Header Banner & Scope Toolbar */}
      <motion.div variants={fadeUpVariants} className="bg-[#EDE4D0] rounded-2xl border border-[#D9CFBB] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D9CFBB] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#C97B5A]">
              <Bot className="h-4 w-4 text-[#C97B5A]" />
              <span>Government Training Assistant</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#0A0A0A] tracking-tight">
              Administrative Assistant & Copilot
            </h1>
            <p className="text-body text-[#6B6357] font-normal">
              Answers are strictly grounded in approved government training modules and official administrative curriculum.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Module Scope Selector */}
            <div className="flex items-center gap-2 bg-[#F5EFE0] px-3.5 py-2 rounded-full border border-[#D9CFBB] shadow-sm min-h-[40px]">
              <BookOpen className="h-4 w-4 text-[#C9A24A] shrink-0" />
              <label htmlFor="context-select" className="text-caption font-mono font-semibold text-[#6B6357] shrink-0 text-[11px]">
                Scope:
              </label>
              <select
                id="context-select"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                disabled={isLoading}
                className="text-caption font-mono font-medium text-[#0A0A0A] bg-transparent focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-[11px]"
              >
                <option value="auto">Auto-Detect Relevant Module ✨</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-mono font-medium text-[#0A0A0A] border border-[#D9CFBB] rounded-full bg-[#F5EFE0] hover:bg-[#EFE6D2] transition-all shadow-sm cursor-pointer min-h-[40px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* 2. Trust & Grounding Indicator Strip */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#F5EFE0] border border-[#D9CFBB] text-caption text-[#6B6357]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#2A5B4A] shrink-0" />
            <span>
              <strong className="font-semibold text-[#0A0A0A]">Training scope:</strong> {activeModuleTitle}
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#2A5B4A] bg-[#2A5B4A]/10 px-2.5 py-0.5 rounded-full border border-[#2A5B4A]/30 hidden sm:inline">
            Curriculum Grounded
          </span>
        </div>
      </motion.div>

      {/* Targeted Remediation Banner */}
      {incomingCompetency && (
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-2xl bg-[#C97B5A]/10 border border-[#C97B5A]/30 text-caption text-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#C97B5A]/20 text-[#C97B5A] shrink-0">
              <Sparkles className="h-5 w-5 text-[#C97B5A]" />
            </div>
            <div>
              <div className="font-serif font-bold text-base text-[#0A0A0A] leading-snug">
                Targeted Remediation Active: {incomingCompetency}
              </div>
              <p className="text-caption text-[#6B6357] font-normal">
                Grounded guidance tailored to resolve this specific operational skill gap.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                sendQuestionText(
                  `Give me a practice scenario to test my understanding of ${incomingCompetency}`,
                  'test_understanding'
                )
              }
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-[#F5EFE0] border border-[#D9CFBB] text-caption font-medium text-[#0A0A0A] hover:bg-[#EFE6D2] transition-colors cursor-pointer disabled:opacity-60 shadow-sm min-h-[38px]"
            >
              Practice Scenario
            </button>
            <button
              type="button"
              onClick={() =>
                sendQuestionText(
                  `What critical mistakes and red flags should I avoid in ${incomingCompetency}?`,
                  'pitfalls'
                )
              }
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-[#F5EFE0] border border-[#D9CFBB] text-caption font-medium text-[#0A0A0A] hover:bg-[#EFE6D2] transition-colors cursor-pointer disabled:opacity-60 shadow-sm min-h-[38px]"
            >
              Red Flags
            </button>
          </div>
        </motion.div>
      )}

      {/* Error Alert with AnimatePresence */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            className="p-4 rounded-xl bg-[#C97B5A]/10 border border-[#C97B5A]/30 text-caption text-[#C97B5A] flex items-center justify-between gap-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#C97B5A] shrink-0" />
              <span>{error}</span>
            </div>
            {lastFailedQuestion && (
              <button
                type="button"
                onClick={handleRetryLast}
                className="flex items-center gap-1.5 px-3.5 py-1 bg-[#F5EFE0] border border-[#D9CFBB] text-[#0A0A0A] rounded-full font-medium hover:bg-[#EFE6D2] text-caption cursor-pointer shadow-sm"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 70/30 Asymmetric Layout: 70% Conversation + 30% Training Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols on lg): Conversation Stage */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-8 space-y-4">
          <Card className="min-h-[560px] flex flex-col justify-between p-6 sm:p-8 bg-[#EDE4D0] border border-[#D9CFBB] shadow-sm rounded-2xl">
            {/* If only initial greeting message, display editorial artwork empty state */}
            {messages.length <= 1 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-6">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-[#D9CFBB] bg-[#F5EFE0]">
                  <img
                    src="/illustrations/copilot_empty_illustration.jpg"
                    alt="Training Copilot"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#0A0A0A] tracking-tight">
                    Ask Anything Regarding Government Workflows
                  </h3>
                  <p className="text-caption text-[#6B6357] leading-relaxed font-normal">
                    {messages[0]?.text || "Hello! I am your official Government Training Copilot. Ask me any question regarding document verification, portal workflows, cybersecurity standards, or record retention. All answers are strictly grounded in approved curriculum."}
                  </p>
                </div>

                {/* Quick Prompt Suggestions */}
                <div className="w-full max-w-lg pt-2">
                  <QuickPromptGrid
                    prompts={PROMPT_SUGGESTIONS}
                    onSelectPrompt={(p) => sendQuestionText(p)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[560px] pr-2 mb-4">
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
                      className="flex gap-3 items-center text-[#6B6357] text-caption"
                    >
                      <div className="h-8 w-8 rounded-full bg-[#0A0A0A] text-[#F5EFE0] flex items-center justify-center shadow-sm shrink-0 border border-[#D9CFBB]">
                        <Bot className="h-4 w-4 text-[#C9A24A]" />
                      </div>
                      <div className="flex items-center gap-2 bg-[#F5EFE0] border border-[#D9CFBB] px-4 py-2.5 rounded-full shadow-sm">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0A0A0A]" />
                        <span className="font-mono text-[11px] text-[#0A0A0A]">
                          Verifying against official training curriculum...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Form Bar */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 pt-4 border-t border-[#D9CFBB] bg-transparent">
              <Input
                placeholder="Ask about verification rules, SLA timelines, cybersecurity standards..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-caption bg-[#F5EFE0] border-[#D9CFBB] focus:bg-[#FAF6ED] rounded-full min-h-[46px] px-5"
              />
              <Button
                type="submit"
                size="md"
                disabled={isLoading || !inputQuestion.trim()}
                className="px-6 min-h-[46px] rounded-full shadow-sm shrink-0 cursor-pointer bg-[#0A0A0A] hover:bg-[#262626] text-[#F5EFE0] font-medium text-[13px]"
              >
                <Send className="h-4 w-4 mr-1.5" />
                <span>Send</span>
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Right Column (4 cols on lg): Contextual Training Intelligence Panel */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-4 space-y-4">
          <div className="bg-[#EDE4D0] rounded-2xl border border-[#D9CFBB] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9CFBB] pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#6B6357]">
                CURRENT TRAINING CONTEXT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#2A5B4A]/10 text-[#2A5B4A] text-[10px] font-mono font-semibold border border-[#2A5B4A]/30">
                Grounded
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B6357]">
                Active Training Scope
              </h4>
              <p className="font-serif font-bold text-base text-[#0A0A0A] leading-snug">
                {activeModuleTitle}
              </p>
              <p className="text-[11px] text-[#6B6357]">
                Factual responses drawn directly from certified public service training curriculum.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-2 text-[11px] text-[#6B6357]">
              <div className="flex items-center gap-1.5 font-semibold text-[#0A0A0A] text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2A5B4A]" />
                <span>Anti-Hallucination Policy</span>
              </div>
              <p>
                The Training Copilot will refuse questions outside official government procedures or public administration standards.
              </p>
            </div>

            {/* Contextual Quick Action Triggers */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6357] block">
                Targeted Practice
              </span>

              <button
                type="button"
                onClick={() =>
                  sendQuestionText(
                    `Give me an operational workplace scenario to test my understanding of ${activeModuleTitle}`,
                    'procedure'
                  )
                }
                disabled={isLoading}
                className="w-full text-left p-3 rounded-xl border border-[#D9CFBB] hover:border-[#0A0A0A] bg-[#F5EFE0] hover:bg-[#FAF6ED] transition-all text-caption font-medium text-[#0A0A0A] flex items-center justify-between group cursor-pointer shadow-sm"
              >
                <span>Practice Workplace Scenario</span>
                <span className="text-[#6B6357] group-hover:text-[#0A0A0A] font-bold">→</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  sendQuestionText(
                    `What are the most critical mistakes and pitfalls in ${activeModuleTitle}?`,
                    'pitfalls'
                  )
                }
                disabled={isLoading}
                className="w-full text-left p-3 rounded-xl border border-[#D9CFBB] hover:border-[#0A0A0A] bg-[#F5EFE0] hover:bg-[#FAF6ED] transition-all text-caption font-medium text-[#0A0A0A] flex items-center justify-between group cursor-pointer shadow-sm"
              >
                <span>Inspect Operational Pitfalls</span>
                <span className="text-[#6B6357] group-hover:text-[#0A0A0A] font-bold">→</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TutorChatPage;
