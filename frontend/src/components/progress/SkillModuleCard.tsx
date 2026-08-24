import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { EmployeeSkillItem } from '@/types';
import Card from '@/components/ui/Card';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  PlayCircle,
  RotateCcw,
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
  const isCertified = skill.status === 'certified' || (skill.score_percentage >= 75 && skill.best_score > 0);
  const shouldReduceMotion = useReducedMotion();

  const readinessState = skill.readiness_state || (
    isCertified
      ? 'Certified'
      : skill.score_percentage >= 50
      ? 'Operational'
      : (skill.attempts_count && skill.attempts_count > 0 && skill.score_percentage < 50)
      ? 'Needs Improvement'
      : skill.lessons_completed
      ? 'Assessment Pending'
      : (skill.status === 'in_progress' || (skill.last_accessed_section && skill.last_accessed_section > 0))
      ? 'In Progress'
      : 'Not Started'
  );

  const formatActivityDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'No activity' || dateStr === 'Not started') {
      return 'No activity yet';
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getReadinessBadge = () => {
    switch (readinessState) {
      case 'Certified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <Award className="h-3 w-3 text-emerald-600" />
            <span>Certified</span>
          </span>
        );
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-civic-50 text-civic-800 border border-civic-300">
            <CheckCircle2 className="h-3 w-3 text-civic-700" />
            <span>Operational</span>
          </span>
        );
      case 'Assessment Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-saffron-50 text-saffron-900 border border-saffron-300">
            <Clock className="h-3 w-3 text-saffron-700" />
            <span>Assessment Pending</span>
          </span>
        );
      case 'Needs Improvement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <AlertCircle className="h-3 w-3 text-amber-600" />
            <span>Needs Improvement</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
            <PlayCircle className="h-3 w-3 text-blue-700" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <Circle className="h-3 w-3 text-slate-400" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  const sectionIndex = skill.last_accessed_section ?? 0;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <Card
        className="p-6 sm:p-7 flex flex-col justify-between space-y-6 border border-slate-200/90 shadow-civic-sm hover:shadow-civic-xl transition-all duration-300 bg-white rounded-3xl"
        variant="default"
      >
        <div className="space-y-4">
          {/* Status Badges & Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Administrative Skill
                </span>
                {getReadinessBadge()}
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                {skill.module_title}
              </h3>
            </div>

            {isCertified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0 shadow-civic-xs">
                <Award className="h-3.5 w-3.5 text-emerald-600" />
                <span>Certified Standard</span>
              </span>
            )}
          </div>

          {/* Competency Evidence & Metrics Box */}
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {/* Lesson Completion Toggle */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Official Curriculum:</span>
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => onToggleLessons(skill.module_id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-civic-xs ${
                  skill.lessons_completed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-civic-700 hover:text-civic-900'
                }`}
              >
                {skill.lessons_completed ? 'Completed' : 'Mark as Read'}
              </motion.button>
            </div>

            {/* Assessment Score Summary */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Best Assessment:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-civic-900 font-mono">
                  {skill.total_questions > 0
                    ? `${skill.best_score} / ${skill.total_questions} (${skill.score_percentage}%)`
                    : 'Not attempted'}
                </span>
                {typeof skill.score_improvement_delta === 'number' && skill.score_improvement_delta > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span>+{skill.score_improvement_delta}%</span>
                  </span>
                )}
              </div>
            </div>

            {/* Graphical Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={shouldReduceMotion ? { width: `${Math.max(5, skill.score_percentage)}%` } : { width: '0%' }}
                animate={{ width: `${Math.max(5, skill.score_percentage)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-2.5 rounded-full ${
                  isCertified
                    ? 'bg-emerald-600'
                    : readinessState === 'Operational' || readinessState === 'Assessment Pending'
                    ? 'bg-civic-700'
                    : readinessState === 'Needs Improvement'
                    ? 'bg-amber-500'
                    : 'bg-slate-300'
                }`}
              />
            </div>

            {/* Assessment Attempts & Activity Metadata */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span>
                {skill.attempts_count && skill.attempts_count > 0
                  ? `${skill.attempts_count} assessment attempt${skill.attempts_count === 1 ? '' : 's'}`
                  : '0 attempts taken'}
              </span>
              <span>Last activity: {formatActivityDate(skill.last_activity_at || skill.updated_at)}</span>
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
            <span>{sectionIndex > 0 ? `Resume (Section ${sectionIndex + 1})` : 'Read Curriculum'}</span>
          </Link>

          <div className="flex items-center gap-2">
            {isCertified && (
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                onClick={() => onViewCertificate(skill)}
                className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-300 transition-all shadow-civic-xs cursor-pointer"
              >
                <Award className="h-3.5 w-3.5 text-emerald-600" />
                <span>Certificate</span>
              </motion.button>
            )}

            <Link
              to={`/quiz/${skill.module_id}`}
              className={`inline-flex items-center gap-1 font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-civic-xs group ${
                isCertified
                  ? 'text-civic-800 bg-civic-50 hover:bg-civic-100 border border-civic-200/90'
                  : skill.attempts_count && skill.attempts_count > 0
                  ? 'text-white bg-amber-600 hover:bg-amber-700'
                  : 'text-white bg-civic-800 hover:bg-civic-900'
              }`}
            >
              {isCertified ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5 text-civic-700" />
                  <span>Retake Assessment</span>
                </>
              ) : skill.attempts_count && skill.attempts_count > 0 ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5 text-white" />
                  <span>Retake Quiz</span>
                </>
              ) : (
                <>
                  <span>Take Assessment</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SkillModuleCard;
