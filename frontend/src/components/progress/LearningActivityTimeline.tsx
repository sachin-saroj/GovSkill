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
        return <Award className="h-3.5 w-3.5 text-emerald-600" />;
      case 'quiz_improved':
        return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
      case 'quiz_attempt':
        return <Target className="h-3.5 w-3.5 text-civic-700" />;
      case 'lesson_completed':
        return <BookCheck className="h-3.5 w-3.5 text-blue-600" />;
      case 'lesson_started':
        return <PlayCircle className="h-3.5 w-3.5 text-slate-600" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getActivityTag = (type: string) => {
    switch (type) {
      case 'certification':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'quiz_improved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'quiz_attempt':
        return 'bg-civic-50 text-civic-800 border-civic-200';
      case 'lesson_completed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'lesson_started':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-[#C9A24A]" />
        <h3 className="font-serif font-bold text-xl text-[#0A0A0A] tracking-tight">
          Learning & Assessment Audit Trail
        </h3>
      </div>

      {activities.length === 0 ? (
        <Card className="p-6 rounded-2xl text-center border border-[#D9CFBB] bg-[#EDE4D0] shadow-sm">
          <p className="text-caption text-[#6B6357]">
            No recent activity recorded yet. Read module lessons or submit assessments to build your activity audit log.
          </p>
        </Card>
      ) : (
        <Card className="p-6 rounded-2xl border border-[#D9CFBB] bg-[#EDE4D0] shadow-sm">
          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-[#D9CFBB]">
            {activities.map((act, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[27px] top-0.5 h-6 w-6 rounded-full bg-[#F5EFE0] border-2 border-[#D9CFBB] group-hover:border-[#0A0A0A] flex items-center justify-center transition-colors shadow-sm">
                  {getActivityIcon(act.activity_type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-semibold text-[#0A0A0A]">
                        {act.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getActivityTag(
                          act.activity_type
                        )}`}
                      >
                        {act.module_title}
                      </span>
                    </div>
                    <span className="text-caption font-mono text-[#6B6357]">
                      {formatDate(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-caption text-[#6B6357]">
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
