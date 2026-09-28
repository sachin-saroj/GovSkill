import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import api from '@/lib/api';
import { Module, EmployeeSkillStatusResponse, EmployeeSkillItem } from '@/types';
import ModuleSidebar from '@/components/learning/ModuleSidebar';
import LessonReader from '@/components/learning/LessonReader';
import { EmptyState, ErrorAlert } from '@/components/ui';
import { BookOpen, Loader2, CheckCircle2 } from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

export const ModulePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());
  const [skillProgressMap, setSkillProgressMap] = useState<Record<string, EmployeeSkillItem>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const fetchSkillProgress = async () => {
    try {
      const res = await api.get<EmployeeSkillStatusResponse>('/progress/my-skills');
      const completedSet = new Set<string>();
      const progMap: Record<string, EmployeeSkillItem> = {};
      res.data.skills.forEach((s) => {
        progMap[s.module_id] = s;
        if (s.lessons_completed) {
          completedSet.add(s.module_id);
        }
      });
      setCompletedModuleIds((prev) => new Set([...prev, ...completedSet]));
      setSkillProgressMap((prev) => ({ ...prev, ...progMap }));
      return progMap;
    } catch {
      return {};
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const [modRes, progMap] = await Promise.all([
          api.get<Module[]>('/modules'),
          fetchSkillProgress(),
        ]);
        setModules(modRes.data);
        if (modRes.data.length > 0) {
          const paramId = searchParams.get('id') || searchParams.get('moduleId');
          const paramSection = searchParams.get('section');
          const targetMod = paramId ? modRes.data.find((m) => m.id === paramId) : null;
          const initialMod = targetMod || modRes.data[0];
          setSelectedModule(initialMod);

          if (paramSection !== null && !isNaN(parseInt(paramSection, 10))) {
            setCurrentSectionIndex(parseInt(paramSection, 10));
          } else {
            // Resume last accessed section if stored on server
            const savedSection = progMap[initialMod.id]?.last_accessed_section ?? 0;
            setCurrentSectionIndex(savedSection);
          }
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
      const savedSection = skillProgressMap[target.id]?.last_accessed_section ?? 0;
      setSearchParams({ id: target.id, section: String(savedSection) });
      setStatusMessage(null);
      setCurrentSectionIndex(savedSection);
    }
  };

  const handleSectionChange = async (index: number) => {
    setCurrentSectionIndex(index);
    if (!selectedModule) return;

    // Sync section access to backend for persistence & resume
    try {
      await api.post(`/progress/modules/${selectedModule.id}/access-section`, {
        section_index: index,
      });
      setSkillProgressMap((prev) => ({
        ...prev,
        [selectedModule.id]: {
          ...(prev[selectedModule.id] || {}),
          last_accessed_section: index,
        } as EmployeeSkillItem,
      }));
    } catch {
      // Non-blocking sync
    }
  };

  const handleCompleteLessons = async () => {
    if (!selectedModule || isMarkingComplete) return;

    setIsMarkingComplete(true);
    setStatusMessage(null);
    try {
      const res = await api.post<EmployeeSkillItem>(`/progress/modules/${selectedModule.id}/complete-lessons`);
      setCompletedModuleIds((prev) => new Set([...prev, selectedModule.id]));
      setSkillProgressMap((prev) => ({
        ...prev,
        [selectedModule.id]: res.data,
      }));
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
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-ink-muted">
        <Loader2 className="h-6 w-6 animate-spin text-ink" />
        <span className="font-medium text-sm text-ink">Loading training module content...</span>
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
  const currentProg = selectedModule ? skillProgressMap[selectedModule.id] : undefined;

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* 1. Ambitious Editorial Module Header */}
      <motion.div variants={fadeUpVariants}>
        <div className="bg-surface border border-border-warm rounded-2xl p-6 sm:p-8 shadow-none space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 border border-azure-500/30 bg-azure-500/10 text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-azure-800 rounded-full">
                  <BookOpen className="h-3.5 w-3.5 text-azure-700" />
                  <span>Administrative Training Curriculum</span>
                </span>

                {isCurrentCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-sage-500/15 text-sage-800 border border-sage-500/30 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sage-700" />
                    <span>Curriculum Completed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-surface-light text-ink border border-border-warm rounded-full">
                    In Progress
                  </span>
                )}
              </div>

              <h1 className="font-serif font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-tight">
                {selectedModule?.title || 'Digital Document Handling'}
              </h1>

              <p className="text-body text-ink-muted leading-relaxed font-normal">
                Master official workflows for reviewing, verifying, and indexing citizen documents with zero errors.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-4">
              <div className="bg-surface-light border border-border-warm rounded-xl p-4 text-center min-w-[130px]">
                <span className="text-[10px] font-mono uppercase font-bold text-ink-muted tracking-widest block">
                  MODULE
                </span>
                <span className="font-mono font-black text-2xl text-ink">
                  {String(modules.findIndex((m) => m.id === selectedModule?.id) + 1).padStart(2, '0')}{' '}
                  <span className="text-sm font-normal text-ink-muted">
                    / {String(modules.length).padStart(2, '0')}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Notification Alert with AnimatePresence */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            className="p-4 border border-sage-500/40 bg-sage-500/15 rounded-xl text-xs font-mono font-bold uppercase tracking-wide text-sage-900 flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-sage-700 shrink-0" />
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Grid (Main Reader + Sidebar): 30/70 Asymmetric Disciplined Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Lesson Reader (8 cols on lg) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-8 space-y-6">
          {selectedModule && (
            <LessonReader
              module={selectedModule}
              isCurrentCompleted={isCurrentCompleted}
              isMarkingComplete={isMarkingComplete}
              onCompleteLessons={handleCompleteLessons}
              currentSectionIndex={currentSectionIndex}
              onSectionChange={handleSectionChange}
              completedAt={currentProg?.completed_at}
              startedAt={currentProg?.started_at}
            />
          )}
        </motion.div>

        {/* Sidebar Curriculum & Actions (4 cols on lg) */}
        <motion.div variants={fadeUpVariants} className="lg:col-span-4 space-y-6">
          <ModuleSidebar
            modules={modules}
            selectedModule={selectedModule}
            completedModuleIds={completedModuleIds}
            onSelectModule={handleModuleChange}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModulePage;
