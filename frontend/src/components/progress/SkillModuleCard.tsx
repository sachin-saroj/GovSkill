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
          <Badge variant="certified" className="rounded-full uppercase font-mono text-[10px]">
            <Award className="h-3 w-3 text-sage-700" />
            <span>Certified</span>
          </Badge>
        );
      case 'Operational':
        return (
          <Badge variant="civic" className="rounded-full uppercase font-mono text-[10px]">
            <CheckCircle2 className="h-3 w-3 text-azure-700" />
            <span>Operational</span>
          </Badge>
        );
      case 'Assessment Pending':
        return (
          <Badge variant="attention" className="rounded-full uppercase font-mono text-[10px]">
            <Clock className="h-3 w-3 text-gold-700" />
            <span>Assessment Pending</span>
          </Badge>
        );
      case 'Needs Improvement':
        return (
          <Badge variant="attention" className="rounded-full uppercase font-mono text-[10px]">
            <AlertCircle className="h-3 w-3 text-rose-700" />
            <span>Needs Improvement</span>
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant="in-progress" className="rounded-full uppercase font-mono text-[10px]">
            <PlayCircle className="h-3 w-3 text-azure-700" />
            <span>In Progress</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" className="rounded-full uppercase font-mono text-[10px]">
            <Circle className="h-3 w-3 text-ink-muted" />
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
        className="p-6 flex flex-col justify-between space-y-5 border border-border-warm shadow-none hover:border-ink-muted/30 transition-all duration-200 bg-surface rounded-2xl"
        variant="default"
      >
        <div className="space-y-4">
          {/* Status Badges & Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-warm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted font-bold">
                  Administrative Skill
                </span>
                {getReadinessBadge()}
              </div>
              <h3 className="font-sans font-bold text-base text-ink tracking-tight leading-snug">
                {skill.module_title}
              </h3>
            </div>

            {isCertified && (
              <Badge variant="certified" className="shrink-0 rounded-full uppercase font-mono text-[10px] tracking-wider">
                <Award className="h-3.5 w-3.5 text-sage-800" />
                <span>Certified Standard</span>
              </Badge>
            )}
          </div>

          {/* Competency Evidence & Metrics Box */}
          <div className="space-y-3 bg-surface-light p-4 rounded-xl border border-border-warm">
            {/* Lesson Completion Toggle */}
            <div className="flex items-center justify-between text-caption">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted font-bold">Official Curriculum:</span>
              <button
                type="button"
                onClick={() => onToggleLessons(skill.module_id)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer font-bold border ${
                  skill.lessons_completed
                    ? 'bg-sage-500/15 text-sage-800 border-sage-500/30'
                    : 'bg-surface text-ink border-border-warm hover:bg-surface-strong'
                }`}
              >
                {skill.lessons_completed ? 'Completed' : 'Mark as Read'}
              </button>
            </div>

            {/* Assessment Score Summary */}
            <div className="flex items-center justify-between text-caption">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted font-bold">Best Assessment:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-ink font-mono text-xs">
                  {skill.total_questions > 0
                    ? `${skill.best_score} / ${skill.total_questions} (${skill.score_percentage}%)`
                    : 'Not attempted'}
                </span>
                {typeof skill.score_improvement_delta === 'number' && skill.score_improvement_delta > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-sage-500/15 text-sage-800 border border-sage-500/30 rounded-full">
                    <TrendingUp className="h-3 w-3 text-sage-700" />
                    <span>+{skill.score_improvement_delta}%</span>
                  </span>
                )}
              </div>
            </div>

            {/* Graphical Progress Bar */}
            <div className="w-full bg-surface-strong h-2 rounded-full overflow-hidden">
              <motion.div
                initial={shouldReduceMotion ? { width: `${Math.max(5, skill.score_percentage)}%` } : { width: '0%' }}
                animate={{ width: `${Math.max(5, skill.score_percentage)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-2 rounded-full ${
                  isCertified
                    ? 'bg-sage-600'
                    : readinessState === 'Operational' || readinessState === 'Assessment Pending'
                    ? 'bg-azure-600'
                    : readinessState === 'Needs Improvement'
                    ? 'bg-rose-600'
                    : 'bg-ink-muted/50'
                }`}
              />
            </div>

            {/* Assessment Attempts & Activity Metadata */}
            <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1 border-t border-border-warm font-mono">
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
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-warm text-caption font-bold">
          <Link
            to={`/module?id=${skill.module_id}`}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink hover:text-azure-700 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-azure-700" />
            <span>{sectionIndex > 0 ? `Resume (Section ${sectionIndex + 1})` : 'Read Curriculum'}</span>
          </Link>

          <div className="flex items-center gap-2">
            {isCertified && (
              <button
                type="button"
                onClick={() => onViewCertificate(skill)}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider text-sage-800 bg-sage-500/15 hover:bg-sage-500/25 px-3 py-1.5 rounded-full border border-sage-500/30 transition-all cursor-pointer min-h-[36px]"
              >
                <Award className="h-3.5 w-3.5 text-sage-700" />
                <span>Certificate</span>
              </button>
            )}

            <Link
              to={`/quiz/${skill.module_id}`}
              className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase font-bold tracking-wider px-4 py-1.5 rounded-full min-h-[36px] transition-all cursor-pointer border ${
                isCertified
                  ? 'text-ink bg-surface-light hover:bg-surface-strong border-border-warm'
                  : skill.attempts_count && skill.attempts_count > 0
                  ? 'text-white bg-rose-600 hover:bg-rose-700 border-rose-600'
                  : 'text-surface-light bg-ink hover:bg-ink-muted border-ink'
              }`}
            >
              {isCertified ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5 text-ink" />
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
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
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
