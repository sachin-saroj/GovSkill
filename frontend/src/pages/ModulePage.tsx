import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { Module, EmployeeSkillStatusResponse } from '@/types';
import ModuleSidebar from '@/components/learning/ModuleSidebar';
import LessonReader from '@/components/learning/LessonReader';
import { EmptyState, ErrorAlert } from '@/components/ui';
import { BookOpen, Loader2, CheckCircle2 } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-civic-700" />
        <span className="font-medium text-sm">Loading training module content...</span>
      </div>
    );
  }

  if (error && modules.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <ErrorAlert title="Curriculum Error" message={error} />
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4">
        <EmptyState
          icon={BookOpen}
          title="No training modules available"
          description="Please check back after your administrator publishes a module."
        />
      </div>
    );
  }

  const isCurrentCompleted = selectedModule ? completedModuleIds.has(selectedModule.id) : false;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-civic-950 via-civic-900 to-civic-800 p-6 sm:p-8 text-white shadow-civic-lg border border-civic-800">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-800/80 border border-civic-700 text-xs font-semibold text-slate-200">
            <BookOpen className="h-3.5 w-3.5 text-saffron-400" />
            <span>Core Employee Training Module</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {selectedModule?.title || 'Digital Document Handling'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Master official workflows for reviewing, verifying, and indexing citizen documents with zero errors.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-civic-xs animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Workspace Grid (Main Reader + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Lesson Reader (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedModule && (
            <LessonReader
              module={selectedModule}
              isCurrentCompleted={isCurrentCompleted}
              isMarkingComplete={isMarkingComplete}
              onCompleteLessons={handleCompleteLessons}
            />
          )}
        </div>

        {/* Sidebar Curriculum & Actions (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          <ModuleSidebar
            modules={modules}
            selectedModule={selectedModule}
            completedModuleIds={completedModuleIds}
            onSelectModule={handleModuleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
