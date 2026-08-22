import React from 'react';
import { Link } from 'react-router-dom';
import { EmployeeSkillItem } from '@/types';
import Card from '@/components/ui/Card';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
} from 'lucide-react';

interface SkillModuleCardProps {
  skill: EmployeeSkillItem;
  onToggleLessons: (moduleId: string) => void;
  onViewCertificate: (skill: EmployeeSkillItem) => void;
}

export const SkillModuleCard: React.FC<SkillModuleCardProps> = ({
  skill,
  onToggleLessons,
  onViewCertificate,
}) => {
  const isCertified = skill.status === 'certified';
  const isCompleted = skill.status === 'completed';
  const isInProgress = skill.status === 'in_progress';

  return (
    <Card
      className="p-6 flex flex-col justify-between space-y-6 border border-slate-200/90 shadow-civic-sm hover:shadow-civic-md transition-all duration-200 bg-white"
      variant="default"
    >
      <div className="space-y-4">
        {/* Status Badge & Header */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Training Module
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
              {skill.module_title}
            </h3>
          </div>

          {isCertified && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0 shadow-civic-xs">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span>Certified</span>
            </span>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-civic-50 text-civic-800 border border-civic-300 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-civic-700" />
              <span>Lessons Done</span>
            </span>
          )}

          {isInProgress && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-saffron-50 text-saffron-900 border border-saffron-300 shrink-0">
              <Clock className="h-3.5 w-3.5 text-saffron-600" />
              <span>In Progress</span>
            </span>
          )}

          {skill.status === 'not_started' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
              <Circle className="h-3.5 w-3.5 text-slate-400" />
              <span>Not Started</span>
            </span>
          )}
        </div>

        {/* Progress Indicators Box */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          {/* Lesson Completion Toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Lessons Read:</span>
            <button
              type="button"
              onClick={() => onToggleLessons(skill.module_id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-civic-xs active:scale-95 ${
                skill.lessons_completed
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-civic-700 hover:text-civic-900'
              }`}
            >
              {skill.lessons_completed ? 'Completed' : 'Mark as Read'}
            </button>
          </div>

          {/* Quiz Score Summary */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Best Quiz Score:</span>
            <span className="font-bold text-civic-900 font-mono">
              {skill.total_questions > 0
                ? `${skill.best_score} / ${skill.total_questions} (${skill.score_percentage}%)`
                : 'No quiz taken'}
            </span>
          </div>

          {/* Graphical Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 transition-all duration-500 rounded-full ${
                isCertified
                  ? 'bg-emerald-600'
                  : isInProgress || isCompleted
                  ? 'bg-civic-700'
                  : 'bg-slate-300'
              }`}
              style={{ width: `${Math.max(5, skill.score_percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
        <Link
          to={`/module?id=${skill.module_id}`}
          className="flex items-center gap-1.5 font-bold text-civic-800 hover:text-civic-900 hover:underline"
        >
          <BookOpen className="h-4 w-4 text-civic-700" />
          <span>Read Lessons</span>
        </Link>

        <div className="flex items-center gap-2">
          {isCertified && (
            <button
              type="button"
              onClick={() => onViewCertificate(skill)}
              className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 transition-all shadow-civic-xs cursor-pointer active:scale-95"
            >
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span>Certificate</span>
            </button>
          )}

          <Link
            to={`/quiz/${skill.module_id}`}
            className="inline-flex items-center gap-1 font-bold text-civic-800 hover:text-civic-900 bg-civic-50 hover:bg-civic-100 px-3 py-1.5 rounded-lg border border-civic-200/90 transition-all shadow-civic-xs"
          >
            <span>{isCertified ? 'Retake Quiz' : 'Take Quiz'}</span>
            <ArrowRight className="h-3.5 w-3.5 text-civic-700" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SkillModuleCard;
