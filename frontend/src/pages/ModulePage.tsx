import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { Module } from '@/types';
import { Card } from '@/components/ui/Card';
import { BookOpen, Bot, Award, Loader2, ArrowRight } from 'lucide-react';


export const ModulePage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get<Module[]>('/modules');
        setModules(res.data);
        if (res.data.length > 0) {
          setSelectedModule(res.data[0]);
        }
      } catch (err: any) {
        const msg = err.response?.data?.detail?.error?.message || 'Failed to load module content';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-[#5A6472]">
        <Loader2 className="h-5 w-5 animate-spin text-[#1E4D8C]" />
        <span>Loading training module content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-6 text-sm text-[#C0392B]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner & Module Selector */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1E4D8C] to-[#163A6B] p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-white/80 text-sm font-medium mb-2">
            <BookOpen className="h-5 w-5" />
            <span>Core Employee Training Module</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight mb-2">
            {selectedModule?.title || 'Digital Document Handling'}
          </h1>
          <p className="text-white/90 text-sm max-w-2xl leading-relaxed">
            Master official workflows for reviewing, verifying, and indexing citizen documents with zero errors.
          </p>
        </div>

        {modules.length > 1 && (
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur border border-white/20 shrink-0">
            <label className="block text-[11px] uppercase font-semibold text-white/80 mb-1">
              Switch Training Module:
            </label>
            <select
              value={selectedModule?.id || ''}
              onChange={(e) => {
                const target = modules.find((m) => m.id === e.target.value);
                if (target) setSelectedModule(target);
              }}
              className="w-full px-3 py-1.5 text-xs font-semibold text-[#1A1F2B] bg-white rounded-lg focus:outline-none"
            >
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Lesson Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="prose max-w-none">
            <div className="space-y-6 text-[#1A1F2B]">
              {selectedModule?.content
                .split('# ')
                .filter(Boolean)
                .map((section, idx) => {
                  const lines = section.trim().split('\n');
                  const title = lines[0];
                  const body = lines.slice(1).join('\n');

                  return (
                    <div key={idx} className="border-b border-[#E2E6EB] pb-6 last:border-0 last:pb-0">
                      <h2 className="text-xl font-semibold text-[#1E4D8C] mb-3">{title}</h2>
                      <div className="text-sm text-[#5A6472] leading-relaxed whitespace-pre-line">
                        {body}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>

        {/* Quick Links & Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-[#1A1F2B] mb-4">Module Actions</h3>
            <div className="space-y-4">
              <Link to="/tutor">
                <div className="p-4 rounded-xl border border-[#E2E6EB] bg-[#F7F9FB] hover:border-[#1E4D8C] transition-all group cursor-pointer mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#1E4D8C] font-semibold text-sm">
                      <Bot className="h-4 w-4" />
                      <span>Ask AI Tutor</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#5A6472] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-[#5A6472]">
                    Have questions about document verification rules? Ask the grounded AI Tutor.
                  </p>
                </div>
              </Link>

              <Link to="/quiz">
                <div className="p-4 rounded-xl border border-[#E2E6EB] bg-[#F7F9FB] hover:border-[#1E4D8C] transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#2E9E6B] font-semibold text-sm">
                      <Award className="h-4 w-4" />
                      <span>Take Module Quiz</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#5A6472] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-[#5A6472]">
                    Test your understanding with server-scored MCQs and record your score.
                  </p>
                </div>
              </Link>
            </div>
          </Card>

          <Card className="bg-[#1E4D8C]/5 border-[#1E4D8C]/20">
            <h4 className="text-sm font-semibold text-[#1E4D8C] mb-2">Training Goal</h4>
            <p className="text-xs text-[#5A6472] leading-relaxed">
              Complete all lessons, utilize the AI tutor if needed, and achieve a high score on the module quiz. Your supervisor can view your quiz attempts in the Admin Dashboard.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ModulePage;

