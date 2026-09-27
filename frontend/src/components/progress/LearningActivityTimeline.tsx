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
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'quiz_improved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'quiz_attempt':
        return 'bg-blue-50 text-[#0E50B0] border-blue-200';
      case 'lesson_completed':
        return 'bg-blue-50 text-[#0E50B0] border-blue-200';
      case 'lesson_started':
        return 'bg-[#FAFAFA] text-[#09090B] border-[#E4E4E7]';
      default:
        return 'bg-[#FAFAFA] text-[#71717A] border-[#E4E4E7]';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-[#0E50B0]" />
        <h3 className="font-sans font-black text-xl uppercase tracking-tight text-[#09090B]">
          Learning & Assessment Audit Trail
        </h3>
      </div>

      {activities.length === 0 ? (
        <Card className="p-6 rounded-none text-center border border-[#E4E4E7] bg-white shadow-none">
          <p className="text-caption text-[#71717A]">
            No recent activity recorded yet. Read module lessons or submit assessments to build your activity audit log.
          </p>
        </Card>
      ) : (
        <Card className="p-6 rounded-none border border-[#E4E4E7] bg-white shadow-none">
          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-[#E4E4E7]">
            {activities.map((act, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[27px] top-0.5 h-6 w-6 rounded-none bg-white border border-[#E4E4E7] group-hover:border-[#09090B] flex items-center justify-center transition-colors shadow-none">
                  {getActivityIcon(act.activity_type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-bold text-[#09090B]">
                        {act.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${getActivityTag(
                          act.activity_type
                        )}`}
                      >
                        {act.module_title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#71717A]">
                      {formatDate(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-caption text-[#52525B]">
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
