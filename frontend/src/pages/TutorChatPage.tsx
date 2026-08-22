import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { Module } from '@/types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Loader2,
  BookOpen,
  Tag,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  matched_module_title?: string;
  timestamp: string;
}

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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E6EB] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1E4D8C] font-semibold text-sm mb-1">
            <Sparkles className="h-4 w-4 text-[#D98E04]" />
            <span>AI Training Assistant</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1F2B]">Interactive AI Tutor</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Module Scope Selector */}
          <div className="flex items-center gap-2 bg-[#F7F9FB] px-3 py-1.5 rounded-xl border border-[#E2E6EB] shrink-0">
            <BookOpen className="h-4 w-4 text-[#1E4D8C]" />
            <label htmlFor="context-select" className="text-xs font-semibold text-[#5A6472]">Context:</label>
            <select
              id="context-select"
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              disabled={isLoading}
              className="text-xs font-semibold text-[#1A1F2B] bg-transparent focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6472] border border-[#E2E6EB] rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/30 text-xs text-[#C0392B]">
          {error}
        </div>
      )}

      {/* Suggested Questions Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase text-[#5A6472] block">
          Quick Questions / Prompt Starters:
        </span>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendQuestionText(suggestion)}
              disabled={isLoading}
              className="text-xs text-left px-3 py-1.5 bg-[#F7F9FB] border border-[#E2E6EB] hover:border-[#1E4D8C] hover:text-[#1E4D8C] text-[#5A6472] rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <Card className="min-h-[420px] flex flex-col justify-between p-6">
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2 mb-4">
          {messages.map((msg) => {
            const matchedMod = findModuleByTitle(msg.matched_module_title);

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'tutor' && (
                  <div className="h-8 w-8 rounded-full bg-[#1E4D8C]/10 text-[#1E4D8C] flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1E4D8C] text-white rounded-br-none'
                      : 'bg-[#F7F9FB] border border-[#E2E6EB] text-[#1A1F2B] rounded-bl-none'
                  }`}
                >
                  {msg.matched_module_title && (
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1E4D8C] bg-[#1E4D8C]/10 px-2 py-0.5 rounded-full border border-[#1E4D8C]/20">
                        <Tag className="h-3 w-3" />
                        <span>Source: {msg.matched_module_title}</span>
                      </div>

                      {matchedMod && (
                        <Link
                          to={`/module?id=${matchedMod.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1E4D8C] hover:underline"
                        >
                          <span>Open Lesson</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      msg.sender === 'user' ? 'text-white/70 text-right' : 'text-[#5A6472]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-[#1E4D8C] text-white flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-[#5A6472] text-xs">
              <div className="h-8 w-8 rounded-full bg-[#1E4D8C]/10 text-[#1E4D8C] flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 bg-[#F7F9FB] border border-[#E2E6EB] px-4 py-2.5 rounded-2xl">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1E4D8C]" />
                <span>Matching question with module knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-[#E2E6EB]">
          <Input
            placeholder="Ask a question about document guidelines, SLA rules, cybersecurity..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !inputQuestion.trim()}>
            <Send className="h-4 w-4 mr-1" />
            <span>Send</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default TutorChatPage;
