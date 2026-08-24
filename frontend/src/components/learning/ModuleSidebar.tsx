import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-6">
      {/* Module Curriculum Navigation Card */}
      <Card className="bg-white border-slate-200 shadow-civic-sm p-5 sm:p-6 space-y-4 rounded-3xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-civic-700" />
            <h3 className="text-sm font-bold text-slate-900">Training Curriculum</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {completedModuleIds.size}/{modules.length} Read
          </span>
        </div>

        {/* Mobile Dropdown View */}
        <div className="block lg:hidden">
          <label
            htmlFor="training-module-selector"
            className="block text-[11px] uppercase font-bold text-slate-600 mb-1.5 tracking-wider"
          >
            Switch Training Module:
          </label>
          <select
            id="training-module-selector"
            value={selectedModule?.id || ''}
            onChange={(e) => onSelectModule(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-civic-700/20 focus:border-civic-700 cursor-pointer"
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
              <motion.button
                key={mod.id}
                type="button"
                whileHover={shouldReduceMotion ? {} : { x: 3 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => onSelectModule(mod.id)}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-civic-50 text-civic-950 border-civic-300 ring-2 ring-civic-700/15 font-bold shadow-civic-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      isSelected ? 'bg-civic-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </div>

                {isCompleted && (
                  <span title="Lessons Completed">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Module Learning Actions Card */}
      <Card className="bg-white border-slate-200 shadow-civic-sm p-5 sm:p-6 space-y-4 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Module Actions
        </h3>

        <div className="space-y-3">
          {/* Ask AI Tutor Link */}
          <Link
            to={`/tutor?module=${selectedModule?.id || 'auto'}`}
            className="block p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-civic-300 transition-all group shadow-civic-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-civic-800 font-bold text-xs">
                <Bot className="h-4 w-4 text-civic-700" />
                <span>Ask AI Tutor</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-civic-700 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Have questions about this module? Ask the grounded AI Tutor.
            </p>
          </Link>

          {/* Take Module Quiz Link */}
          <Link
            to={`/quiz/${selectedModule?.id || 'default'}`}
            className="block p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all group shadow-civic-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>Take Module Quiz</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Test your understanding with server-scored MCQs and record your score.
            </p>
          </Link>
        </div>
      </Card>

      {/* Training Standards Guidance Card */}
      <Card className="bg-civic-50/60 border-civic-200/80 p-4 shadow-civic-xs space-y-1.5 rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs font-bold text-civic-900">
          <HelpCircle className="h-3.5 w-3.5 text-civic-700" />
          <h4>Training Goal</h4>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Complete all lessons, utilize the AI tutor if needed, and achieve a high score on the module quiz. Your supervisor can view your quiz attempts in the Admin Dashboard.
        </p>
      </Card>
    </div>
  );
};

export default ModuleSidebar;
