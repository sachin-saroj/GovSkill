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
      <Card className="bg-[#EDE4D0] border border-[#D9CFBB] shadow-sm p-6 space-y-4 rounded-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9CFBB]">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#C9A24A]" />
            <h3 className="font-serif font-bold text-base text-[#0A0A0A]">Training Curriculum</h3>
          </div>
          <span className="text-caption font-semibold text-[#6B6357] font-mono text-[11px]">
            {completedModuleIds.size} / {modules.length} Read
          </span>
        </div>

        {/* Mobile Dropdown View */}
        <div className="block lg:hidden">
          <label
            htmlFor="training-module-selector"
            className="block text-[10px] font-mono uppercase font-semibold text-[#6B6357] mb-1.5 tracking-wider"
          >
            Switch Training Module:
          </label>
          <select
            id="training-module-selector"
            value={selectedModule?.id || ''}
            onChange={(e) => onSelectModule(e.target.value)}
            className="w-full px-4 py-2.5 text-caption font-mono font-medium text-[#0A0A0A] bg-[#F5EFE0] border border-[#D9CFBB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]/20 focus:border-[#0A0A0A] cursor-pointer min-h-[44px]"
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
                    ? 'bg-[#0A0A0A] text-[#F5EFE0] border-[#0A0A0A] font-medium shadow-sm'
                    : 'bg-[#F5EFE0] text-[#0A0A0A] border-[#D9CFBB] hover:bg-[#EFE6D2] font-normal'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-mono font-semibold text-[10px] shrink-0 ${
                      isSelected ? 'bg-[#EDE4D0] text-[#0A0A0A]' : 'bg-[#E4D9C3] text-[#6B6357]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </div>

                {isCompleted && (
                  <span title="Lessons Completed">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#C9A24A]' : 'text-[#2A5B4A]'}`} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Module Learning Actions Card */}
      <Card className="bg-[#EDE4D0] border border-[#D9CFBB] shadow-sm p-6 space-y-4 rounded-2xl">
        <h3 className="font-serif font-bold text-base text-[#0A0A0A] pb-2 border-b border-[#D9CFBB]">
          Module Actions
        </h3>

        <div className="space-y-3">
          {/* Ask AI Tutor Link */}
          <Link
            to={`/tutor?module=${selectedModule?.id || 'auto'}`}
            className="block p-4 rounded-xl border border-[#D9CFBB] bg-[#F5EFE0] hover:bg-[#EFE6D2] transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-[#0A0A0A] font-serif font-semibold text-caption">
                <Bot className="h-4 w-4 text-[#C97B5A]" />
                <span>Ask AI Tutor</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[#6B6357] group-hover:text-[#0A0A0A] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-caption text-[#6B6357] leading-relaxed font-normal">
              Have questions about this module? Ask the grounded AI Tutor.
            </p>
          </Link>

          {/* Take Module Quiz Link */}
          <Link
            to={`/quiz/${selectedModule?.id || 'default'}`}
            className="block p-4 rounded-xl border border-[#D9CFBB] bg-[#F5EFE0] hover:bg-[#EFE6D2] transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-[#0A0A0A] font-serif font-semibold text-caption">
                <Award className="h-4 w-4 text-[#C9A24A]" />
                <span>Take Module Quiz</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[#6B6357] group-hover:text-[#0A0A0A] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-caption text-[#6B6357] leading-relaxed font-normal">
              Test your understanding with server-scored MCQs and record your score.
            </p>
          </Link>
        </div>
      </Card>

      {/* Training Standards Guidance Card */}
      <Card className="bg-[#F5EFE0] border border-[#D9CFBB] p-4 shadow-sm space-y-1.5 rounded-xl">
        <div className="flex items-center gap-1.5 text-caption font-serif font-semibold text-[#0A0A0A]">
          <HelpCircle className="h-3.5 w-3.5 text-[#C9A24A]" />
          <h4>Training Goal</h4>
        </div>
        <p className="text-caption text-[#6B6357] leading-relaxed font-normal">
          Complete all lessons, utilize the AI tutor if needed, and achieve a high score on the module quiz. Your supervisor can view your quiz attempts in the Admin Dashboard.
        </p>
      </Card>
    </div>
  );
};

export default ModuleSidebar;
