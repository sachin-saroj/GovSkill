import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/apiError';
import { Module } from '@/types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Bot, Send, User, Sparkles, Loader2, BookOpen, Tag } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  matched_module_title?: string;
  timestamp: string;
}

export const TutorChatPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('auto');
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

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get<Module[]>('/modules');
        setModules(res.data);
      } catch (error: unknown) {
        console.warn(getApiErrorMessage(error, 'Failed to load modules list for tutor dropdown'));
      }
    };
    fetchModules();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;

    const userMsgText = inputQuestion.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<{ answer: string; matched_module_title?: string }>('/tutor/ask', {
        module_id: selectedModuleId,
        question: userMsgText,
      });

      const tutorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: res.data.answer,
        matched_module_title: res.data.matched_module_title,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'Failed to get answer from AI Tutor'));
    } finally {
      setIsLoading(false);
    }
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

        {/* Module Scope Selector */}
        <div className="flex items-center gap-2 bg-[#F7F9FB] px-3 py-1.5 rounded-xl border border-[#E2E6EB] shrink-0">
          <BookOpen className="h-4 w-4 text-[#1E4D8C]" />
          <label className="text-xs font-semibold text-[#5A6472]">Context:</label>
          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="text-xs font-semibold text-[#1A1F2B] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="auto">Auto-Detect Relevant Module ✨</option>
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/30 text-xs text-[#C0392B]">
          {error}
        </div>
      )}

      {/* Messages Container */}
      <Card className="min-h-[450px] flex flex-col justify-between p-6">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 mb-4">
          {messages.map((msg) => (
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
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1E4D8C] bg-[#1E4D8C]/10 px-2 py-0.5 rounded-full mb-2 border border-[#1E4D8C]/20">
                    <Tag className="h-3 w-3" />
                    <span>Source: {msg.matched_module_title}</span>
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
          ))}

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

