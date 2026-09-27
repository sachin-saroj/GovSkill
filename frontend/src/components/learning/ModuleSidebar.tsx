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
      <Card className="bg-white border border-[#E4E4E7] shadow-none p-6 space-y-4 rounded-none">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#0E50B0]" />
            <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-black">
              Training Curriculum
            </h3>
          </div>
          <span className="text-caption font-bold text-[#71717A] font-mono text-[11px] uppercase tracking-wider">
            {completedModuleIds.size} / {modules.length} Read
          </span>
        </div>

        {/* Mobile Dropdown View */}
        <div className="block lg:hidden">
          <label
            htmlFor="training-module-selector"
            className="block text-[10px] font-mono uppercase font-bold text-[#71717A] mb-1.5 tracking-wider"
          >
            Switch Training Module:
          </label>
          <select
            id="training-module-selector"
            value={selectedModule?.id || ''}
            onChange={(e) => onSelectModule(e.target.value)}
            className="w-full px-4 py-2.5 text-caption font-mono font-medium text-black bg-white border border-[#E4E4E7] rounded-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer min-h-[44px]"
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
                className={`w-full text-left p-3.5 rounded-none border text-caption transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white text-black border-[#E4E4E7] hover:bg-zinc-50 font-normal'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-6 w-6 rounded-none flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                      isSelected ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-[#71717A]'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </div>

                {isCompleted && (
                  <span title="Lessons Completed">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#0E50B0]' : 'text-emerald-600'}`} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Module Learning Actions Card */}
      <Card className="bg-white border border-[#E4E4E7] shadow-none p-6 space-y-4 rounded-none">
        <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-black pb-2 border-b border-[#E4E4E7]">
          Module Actions
        </h3>

        <div className="space-y-3">
          {/* Ask AI Tutor Link */}
          <Link
            to={`/tutor?module=${selectedModule?.id || 'auto'}`}
            className="block p-4 rounded-none border border-[#E4E4E7] bg-white hover:border-[#0E50B0] transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-black font-sans font-bold text-xs uppercase tracking-wider">
                <Bot className="h-4 w-4 text-[#0E50B0]" />
                <span>Ask AI Tutor</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[#71717A] group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-caption text-[#71717A] leading-relaxed font-normal">
              Have questions about this module? Ask the grounded AI Tutor.
            </p>
          </Link>

          {/* Take Module Quiz Link */}
          <Link
            to={`/quiz/${selectedModule?.id || 'default'}`}
            className="block p-4 rounded-none border border-[#E4E4E7] bg-white hover:border-[#0E50B0] transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-black font-sans font-bold text-xs uppercase tracking-wider">
                <Award className="h-4 w-4 text-[#0E50B0]" />
                <span>Take Module Quiz</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[#71717A] group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-caption text-[#71717A] leading-relaxed font-normal">
              Test your understanding with server-scored MCQs and record your score.
            </p>
          </Link>
        </div>
      </Card>

      {/* Training Standards Guidance Card */}
      <Card className="bg-white border border-[#E4E4E7] p-4 shadow-none space-y-1.5 rounded-none">
        <div className="flex items-center gap-2 text-caption font-mono font-bold uppercase tracking-wider text-black">
          <HelpCircle className="h-3.5 w-3.5 text-[#0E50B0]" />
          <h4>Training Goal</h4>
        </div>
        <p className="text-caption text-[#71717A] leading-relaxed font-normal">
          Complete all lessons, utilize the AI tutor if needed, and achieve a high score on the module quiz. Your supervisor can view your quiz attempts in the Admin Dashboard.
        </p>
      </Card>
    </div>
  );
};

export default ModuleSidebar;
