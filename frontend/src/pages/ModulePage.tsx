import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { Module, EmployeeSkillStatusResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import { BookOpen, Bot, Award, Loader2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const ModulePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchSkillProgress = async () => {
    try {
      const res = await api.get<EmployeeSkillStatusResponse>('/progress/my-skills');
      const completedSet = new Set<string>();
      res.data.skills.forEach((s) => {
        if (s.lessons_completed) {
          completedSet.add(s.module_id);
        }
      });
      setCompletedModuleIds(completedSet);
    } catch {
      // Non-blocking progress sync
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const [modRes] = await Promise.all([
          api.get<Module[]>('/modules'),
          fetchSkillProgress(),
        ]);
        setModules(modRes.data);
        if (modRes.data.length > 0) {
          const paramId = searchParams.get('id') || searchParams.get('moduleId');
          const targetMod = paramId ? modRes.data.find((m) => m.id === paramId) : null;
          setSelectedModule(targetMod || modRes.data[0]);
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

  const handleModuleChange = (modId: string) => {
    const target = modules.find((m) => m.id === modId);
    if (target) {
      setSelectedModule(target);
      setSearchParams({ id: target.id });
      setStatusMessage(null);
    }
  };

  const handleCompleteLessons = async () => {
    if (!selectedModule || isMarkingComplete) return;

    setIsMarkingComplete(true);
    setStatusMessage(null);
    try {
      await api.post(`/progress/modules/${selectedModule.id}/complete-lessons`);
      setCompletedModuleIds((prev) => new Set([...prev, selectedModule.id]));
      setStatusMessage('Lesson progress recorded! Competency status updated.');
      fetchSkillProgress();
    } catch (err: any) {
      const msg = err.response?.data?.detail?.error?.message || 'Failed to record lesson completion';
      setError(msg);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-[#5A6472]">
        <Loader2 className="h-5 w-5 animate-spin text-[#1E4D8C]" />
        <span>Loading training module content...</span>
      </div>
    );
  }

  if (error && modules.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-6 text-sm text-[#C0392B]">
          {error}
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-semibold text-[#1A1F2B] mb-2">No training modules available</h2>
        <p className="text-[#5A6472]">Please check back after your administrator publishes a module.</p>
      </div>
    );
  }

  const isCurrentCompleted = selectedModule ? completedModuleIds.has(selectedModule.id) : false;

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
            <label htmlFor="training-module-selector" className="block text-[11px] uppercase font-semibold text-white/80 mb-1">
              Switch Training Module:
            </label>
            <select
              id="training-module-selector"
              value={selectedModule?.id || ''}
              onChange={(e) => handleModuleChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold text-[#1A1F2B] bg-white rounded-lg focus:outline-none cursor-pointer"
            >
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.title} {completedModuleIds.has(mod.id) ? ' (Read)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-[#2E9E6B]/10 border border-[#2E9E6B]/30 text-xs text-[#2E9E6B] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

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

            {/* Bottom Lesson Completion Bar */}
            <div className="mt-8 pt-6 border-t border-[#E2E6EB] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#5A6472]">
                {isCurrentCompleted ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-[#2E9E6B]">
                    <CheckCircle2 className="h-4 w-4" /> Lessons Completed
                  </span>
                ) : (
                  <span>Finished reading? Mark lessons completed to update your skill dashboard.</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleCompleteLessons}
                disabled={isMarkingComplete || isCurrentCompleted}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  isCurrentCompleted
                    ? 'bg-[#2E9E6B]/10 text-[#2E9E6B] border border-[#2E9E6B]/30 cursor-default'
                    : 'bg-[#1E4D8C] text-white hover:bg-[#153866]'
                }`}
              >
                {isMarkingComplete ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving Progress...</span>
                  </>
                ) : isCurrentCompleted ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Mark Lessons as Completed</span>
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>

        {/* Quick Links & Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-[#1A1F2B] mb-4">Module Actions</h3>
            <div className="space-y-4">
              <Link to={`/tutor?module=${selectedModule?.id || 'auto'}`}>
                <div className="p-4 rounded-xl border border-[#E2E6EB] bg-[#F7F9FB] hover:border-[#1E4D8C] transition-all group cursor-pointer mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#1E4D8C] font-semibold text-sm">
                      <Bot className="h-4 w-4" />
                      <span>Ask AI Tutor</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#5A6472] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-[#5A6472]">
                    Have questions about this module? Ask the grounded AI Tutor.
                  </p>
                </div>
              </Link>

              <Link to={`/quiz/${selectedModule?.id || 'default'}`}>
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
