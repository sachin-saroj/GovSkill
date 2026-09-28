import React from 'react';
import { Link } from 'react-router-dom';
import { Module } from '@/types';
import Card from '@/components/ui/Card';
import {
  Bot,
  Award,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface ModuleSidebarProps {
  modules: Module[];
  selectedModule: Module | null;
  completedModuleIds: Set<string>;
  onSelectModule: (moduleId: string) => void;
}

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  modules,
  selectedModule,
  completedModuleIds,
  onSelectModule,
}) => {
  return (
    <div className="space-y-6">
      {/* Module Curriculum Navigation Card */}
      <Card className="bg-surface border border-border-warm shadow-none p-6 space-y-4 rounded-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-warm">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-azure-700" />
            <h3 className="font-serif font-bold text-sm tracking-wide text-ink">
              Training Curriculum
            </h3>
          </div>
          <span className="text-caption font-bold text-ink-muted font-mono text-[11px] uppercase tracking-wider">
            {completedModuleIds.size} / {modules.length} Read
          </span>
        </div>

        {/* Mobile Dropdown View */}
        <div className="block lg:hidden">
          <label
            htmlFor="training-module-selector"
            className="block text-[10px] font-mono uppercase font-bold text-ink-muted mb-1.5 tracking-wider"
          >
            Switch Training Module:
          </label>
          <select
            id="training-module-selector"
            value={selectedModule?.id || ''}
            onChange={(e) => onSelectModule(e.target.value)}
            className="w-full px-4 py-2.5 text-caption font-mono font-medium text-ink bg-surface-light border border-border-warm rounded-xl focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer min-h-[44px]"
          >
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.title} {completedModuleIds.has(mod.id) ? ' (Read)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop List Navigation */}
        <div className="hidden lg:flex flex-col space-y-2">
          {modules.map((mod, idx) => {
            const isSelected = selectedModule?.id === mod.id;
            const isCompleted = completedModuleIds.has(mod.id);

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-caption transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-ink text-on-ink border-ink font-semibold shadow-sm'
                    : 'bg-surface-light text-ink border-border-warm hover:bg-surface-strong font-normal'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-6 w-6 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                      isSelected ? 'bg-white/20 text-on-ink' : 'bg-surface border border-border-warm text-ink-muted'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={`truncate ${isSelected ? 'text-on-ink' : 'text-ink'}`}>{mod.title}</span>
                </div>

                {isCompleted && (
                  <span title="Lessons Completed">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${isSelected ? 'text-azure-300' : 'text-sage-700'}`} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Module Learning Actions Card */}
      <Card className="bg-surface border border-border-warm shadow-none p-6 space-y-4 rounded-2xl">
        <h3 className="font-serif font-bold text-sm tracking-wide text-ink pb-2 border-b border-border-warm">
          Module Actions
        </h3>

        <div className="space-y-3">
          {/* Ask AI Tutor Link */}
          <Link
            to={`/tutor?module=${selectedModule?.id || 'auto'}`}
            className="block p-4 rounded-xl border border-border-warm bg-surface-light hover:border-azure-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-ink font-sans font-bold text-xs uppercase tracking-wider">
                <Bot className="h-4 w-4 text-azure-700" />
                <span>Ask AI Tutor</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-ink-muted group-hover:text-ink group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-caption text-ink-muted leading-relaxed font-normal">
              Have questions about this module? Ask the grounded AI Tutor.
            </p>
          </Link>

          {/* Take Module Quiz Link */}
          <Link
            to={`/quiz/${selectedModule?.id || 'default'}`}
            className="block p-4 rounded-xl border border-border-warm bg-surface-light hover:border-azure-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-ink font-sans font-bold text-xs uppercase tracking-wider">
                <Award className="h-4 w-4 text-azure-700" />
                <span>Take Module Quiz</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-ink-muted group-hover:text-ink group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-caption text-ink-muted leading-relaxed font-normal">
              Test your understanding with server-scored MCQs and record your score.
            </p>
          </Link>
        </div>
      </Card>

      {/* Training Standards Guidance Card */}
      <Card className="bg-surface border border-border-warm p-4 shadow-none space-y-1.5 rounded-2xl">
        <div className="flex items-center gap-2 text-caption font-mono font-bold uppercase tracking-wider text-ink">
          <HelpCircle className="h-3.5 w-3.5 text-azure-700" />
          <h4>Training Goal</h4>
        </div>
        <p className="text-caption text-ink-muted leading-relaxed font-normal">
          Complete all lessons, utilize the AI tutor if needed, and achieve a high score on the module quiz. Your supervisor can view your quiz attempts in the Admin Dashboard.
        </p>
      </Card>
    </div>
  );
};

export default ModuleSidebar;
