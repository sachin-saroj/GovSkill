import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { EmployeeSkillItem } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
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
          <Badge variant="certified">
            <Award className="h-3 w-3 text-emerald-600" />
            <span>Certified</span>
          </Badge>
        );
      case 'Operational':
        return (
          <Badge variant="civic">
            <CheckCircle2 className="h-3 w-3 text-civic-700" />
            <span>Operational</span>
          </Badge>
        );
      case 'Assessment Pending':
        return (
          <Badge variant="attention">
            <Clock className="h-3 w-3 text-saffron-700" />
            <span>Assessment Pending</span>
          </Badge>
        );
      case 'Needs Improvement':
        return (
          <Badge variant="attention">
            <AlertCircle className="h-3 w-3 text-saffron-600" />
            <span>Needs Improvement</span>
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant="in-progress">
            <PlayCircle className="h-3 w-3 text-civic-700" />
            <span>In Progress</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral">
            <Circle className="h-3 w-3 text-slate-400" />
            <span>Not Started</span>
          </Badge>
        );
    }
  };

  const sectionIndex = skill.last_accessed_section ?? 0;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <Card
        className="p-6 flex flex-col justify-between space-y-5 border border-[#D9CFBB] shadow-sm hover:shadow-md transition-all duration-200 bg-[#EDE4D0] rounded-2xl"
        variant="default"
      >
        <div className="space-y-4">
          {/* Status Badges & Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#D9CFBB]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B6357]">
                  Administrative Skill
                </span>
                {getReadinessBadge()}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0A0A0A] tracking-tight leading-snug">
                {skill.module_title}
              </h3>
            </div>

            {isCertified && (
              <Badge variant="certified" className="shrink-0 shadow-sm">
                <Award className="h-3.5 w-3.5 text-[#2A5B4A]" />
                <span>Certified Standard</span>
              </Badge>
            )}
          </div>

          {/* Competency Evidence & Metrics Box */}
          <div className="space-y-3 bg-[#F5EFE0] p-4 rounded-xl border border-[#D9CFBB]">
            {/* Lesson Completion Toggle */}
            <div className="flex items-center justify-between text-caption">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6357]">Official Curriculum:</span>
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => onToggleLessons(skill.module_id)}
                className={`px-3 py-1 rounded-full text-caption font-mono uppercase tracking-wider border transition-all cursor-pointer shadow-sm ${
                  skill.lessons_completed
                    ? 'bg-[#2A5B4A]/10 text-[#2A5B4A] border-[#2A5B4A]/30'
                    : 'bg-[#EDE4D0] text-[#0A0A0A] border-[#D9CFBB] hover:bg-[#E4D9C3]'
                }`}
              >
                {skill.lessons_completed ? 'Completed' : 'Mark as Read'}
              </motion.button>
            </div>

            {/* Assessment Score Summary */}
            <div className="flex items-center justify-between text-caption">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6357]">Best Assessment:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#0A0A0A] font-mono">
                  {skill.total_questions > 0
                    ? `${skill.best_score} / ${skill.total_questions} (${skill.score_percentage}%)`
                    : 'Not attempted'}
                </span>
                {typeof skill.score_improvement_delta === 'number' && skill.score_improvement_delta > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#2A5B4A]/10 text-[#2A5B4A] border border-[#2A5B4A]/30">
                    <TrendingUp className="h-3 w-3 text-[#2A5B4A]" />
                    <span>+{skill.score_improvement_delta}%</span>
                  </span>
                )}
              </div>
            </div>

            {/* Graphical Progress Bar */}
            <div className="w-full bg-[#E0D5BE] border border-[#D9CFBB]/60 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={shouldReduceMotion ? { width: `${Math.max(5, skill.score_percentage)}%` } : { width: '0%' }}
                animate={{ width: `${Math.max(5, skill.score_percentage)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-2 rounded-full ${
                  isCertified
                    ? 'bg-[#2A5B4A]'
                    : readinessState === 'Operational' || readinessState === 'Assessment Pending'
                    ? 'bg-[#0A0A0A]'
                    : readinessState === 'Needs Improvement'
                    ? 'bg-[#C97B5A]'
                    : 'bg-[#D9CFBB]'
                }`}
              />
            </div>

            {/* Assessment Attempts & Activity Metadata */}
            <div className="flex items-center justify-between text-[11px] text-[#6B6357] pt-1 border-t border-[#D9CFBB] font-mono">
              <span>
                {skill.attempts_count && skill.attempts_count > 0
                  ? `${skill.attempts_count} assessment attempt${skill.attempts_count === 1 ? '' : 's'}`
                  : '0 attempts taken'}
              </span>
              <span>Last: {formatActivityDate(skill.last_activity_at || skill.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D9CFBB] text-caption font-semibold">
          <Link
            to={`/module?id=${skill.module_id}`}
            className="flex items-center gap-1.5 font-medium text-[#0A0A0A] hover:text-[#C97B5A] transition-colors"
          >
            <BookOpen className="h-4 w-4 text-[#C9A24A]" />
            <span>{sectionIndex > 0 ? `Resume (Section ${sectionIndex + 1})` : 'Read Curriculum'}</span>
          </Link>

          <div className="flex items-center gap-2">
            {isCertified && (
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => onViewCertificate(skill)}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#2A5B4A] bg-[#2A5B4A]/10 hover:bg-[#2A5B4A]/20 px-3.5 py-1.5 rounded-full border border-[#2A5B4A]/30 transition-all shadow-sm cursor-pointer"
              >
                <Award className="h-3.5 w-3.5 text-[#2A5B4A]" />
                <span>Certificate</span>
              </motion.button>
            )}

            <Link
              to={`/quiz/${skill.module_id}`}
              className={`inline-flex items-center gap-1.5 font-medium text-[13px] px-4 py-2 rounded-full min-h-[40px] transition-all shadow-sm group ${
                isCertified
                  ? 'text-[#0A0A0A] bg-[#E4D9C3] hover:bg-[#D9CFBB] border border-[#D9CFBB]'
                  : skill.attempts_count && skill.attempts_count > 0
                  ? 'text-white bg-[#C97B5A] hover:bg-[#b06647]'
                  : 'text-[#F5EFE0] bg-[#0A0A0A] hover:bg-[#262626]'
              }`}
            >
              {isCertified ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5 text-[#0A0A0A]" />
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
                  <ArrowRight className="h-3.5 w-3.5 text-[#F5EFE0] group-hover:translate-x-0.5 transition-transform" />
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
