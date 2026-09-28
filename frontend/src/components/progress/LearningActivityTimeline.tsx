import React from 'react';
import { LearningActivityItem } from '@/types';
import Card from '@/components/ui/Card';
import { Activity, Award, BookCheck, Clock, TrendingUp, PlayCircle, Target } from 'lucide-react';

interface LearningActivityTimelineProps {
  activities: LearningActivityItem[];
}

export const LearningActivityTimeline: React.FC<LearningActivityTimelineProps> = ({ activities }) => {
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return <Award className="h-3.5 w-3.5 text-emerald-700" />;
      case 'quiz_improved':
        return <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />;
      case 'quiz_attempt':
        return <Target className="h-3.5 w-3.5 text-[#0E50B0]" />;
      case 'lesson_completed':
        return <BookCheck className="h-3.5 w-3.5 text-[#0E50B0]" />;
      case 'lesson_started':
        return <PlayCircle className="h-3.5 w-3.5 text-[#71717A]" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-[#71717A]" />;
    }
  };

  const getActivityTag = (type: string) => {
    switch (type) {
      case 'certification':
        return 'bg-sage-500/15 text-sage-800 border-sage-500/30';
      case 'quiz_improved':
        return 'bg-sage-500/15 text-sage-800 border-sage-500/30';
      case 'quiz_attempt':
        return 'bg-azure-500/15 text-azure-800 border-azure-500/30';
      case 'lesson_completed':
        return 'bg-azure-500/15 text-azure-800 border-azure-500/30';
      case 'lesson_started':
        return 'bg-surface-light text-ink border-border-warm';
      default:
        return 'bg-surface-light text-ink-muted border-border-warm';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-azure-700" />
        <h3 className="font-serif font-bold text-xl tracking-tight text-ink">
          Learning & Assessment Audit Trail
        </h3>
      </div>

      {activities.length === 0 ? (
        <Card className="p-6 rounded-2xl text-center border border-border-warm bg-surface shadow-none">
          <p className="text-caption text-ink-muted">
            No recent activity recorded yet. Read module lessons or submit assessments to build your activity audit log.
          </p>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8 rounded-2xl border border-border-warm bg-surface shadow-none">
          <div className="relative pl-6 space-y-5 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-border-warm">
            {activities.map((act, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[29px] top-0.5 h-7 w-7 rounded-full bg-surface-light border border-border-warm group-hover:border-ink flex items-center justify-center transition-colors shadow-none">
                  {getActivityIcon(act.activity_type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-bold text-ink">
                        {act.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getActivityTag(
                          act.activity_type
                        )}`}
                      >
                        {act.module_title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-ink-muted">
                      {formatDate(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-caption text-ink-muted leading-relaxed font-normal">
                    {act.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LearningActivityTimeline;
