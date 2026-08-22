import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { Module } from '@/types';
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
} from 'lucide-react';

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
      text: "Hello! I am your AI Training Assistant. Ask me any question regarding document verification, portal SLA guidelines, cybersecurity standards, or record retention. I will automatically ground my answer in the relevant training module.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      } catch (err: any) {
        console.warn('Failed to load modules list for tutor dropdown');
      }
    };
    fetchModules();
  }, []);

  const sendQuestionText = async (questionText: string) => {
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
    setIsLoading(true);

    try {
      const res = await api.post<{ answer: string; matched_module_title?: string }>('/tutor/ask', {
        module_id: selectedModuleId,
        question: questionText.trim(),
      });

      const tutorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: res.data.answer,
        matched_module_title: res.data.matched_module_title,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      const msg = err.response?.data?.detail?.error?.message || 'Failed to get answer from AI Tutor';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestionText(inputQuestion);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'tutor',
        text: "Hello! I am your AI Training Assistant. Ask me any question regarding document verification, portal SLA guidelines, cybersecurity standards, or record retention. I will automatically ground my answer in the relevant training module.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError(null);
    setInputQuestion('');
  };

  const findModuleByTitle = (title?: string) => {
    if (!title) return null;
    return modules.find((m) => m.title.toLowerCase().trim() === title.toLowerCase().trim());
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-civic-800 font-bold text-xs">
            <Sparkles className="h-4 w-4 text-saffron-500" />
            <span>AI Training Assistant</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Interactive AI Tutor
          </h1>
          <p className="text-xs text-slate-500">
            Answers are grounded strictly in official training modules and standard operating guidelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Module Scope Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0 shadow-civic-xs">
            <BookOpen className="h-4 w-4 text-civic-700" />
            <label htmlFor="context-select" className="text-xs font-bold text-slate-600">
              Context:
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

          <button
            type="button"
            onClick={handleResetChat}
            title="Reset conversation"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-civic-xs cursor-pointer active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 flex items-center gap-2 shadow-civic-xs animate-fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Suggested Questions Grid */}
      <QuickPromptGrid
        prompts={PROMPT_SUGGESTIONS}
        onSelectPrompt={sendQuestionText}
        disabled={isLoading}
      />

      {/* Chat Messages Workspace */}
      <Card className="min-h-[460px] flex flex-col justify-between p-6 bg-slate-50/50 border-slate-200 shadow-civic-sm">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 mb-4">
          {messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              msg={msg}
              matchedModule={findModuleByTitle(msg.matched_module_title)}
            />
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-600 text-xs animate-fade-in">
              <div className="h-8 w-8 rounded-xl bg-civic-800 text-white flex items-center justify-center shadow-civic-xs">
                <Bot className="h-4 w-4 text-saffron-400" />
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-civic-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-civic-700" />
                <span className="font-medium text-slate-700">
                  Matching question with module knowledge base...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2.5 pt-4 border-t border-slate-200 bg-white -mx-6 -mb-6 p-4 rounded-b-xl">
          <Input
            placeholder="Ask a question about document guidelines, SLA rules, cybersecurity..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm bg-slate-50 border-slate-200 focus:bg-white"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputQuestion.trim()}
            className="px-5 shadow-civic-xs shrink-0"
          >
            <Send className="h-4 w-4 mr-1.5" />
            <span>Send</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default TutorChatPage;
