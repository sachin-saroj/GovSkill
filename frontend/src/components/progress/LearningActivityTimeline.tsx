import React from 'react';
import { LearningActivityItem } from '@/types';
import Card from '@/components/ui/Card';
import { Activity, Award, BookCheck, Clock } from 'lucide-react';

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
      });
    } catch {
      return isoStr;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return <Award className="h-4 w-4 text-emerald-600" />;
      case 'lesson_completed':
        return <BookCheck className="h-4 w-4 text-civic-700" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-civic-700" />
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Recent Learning Activity
        </h3>
      </div>

      {activities.length === 0 ? (
        <Card className="p-6 text-center border-slate-200 bg-white">
          <p className="text-xs text-slate-500">
            No recent activity recorded yet. Read module lessons or submit assessments to build your activity audit log.
          </p>
        </Card>
      ) : (
        <Card className="p-4 sm:p-5 border border-slate-200 bg-white shadow-civic-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[27px] top-0.5 h-6 w-6 rounded-full bg-white border-2 border-slate-300 group-hover:border-civic-700 flex items-center justify-center transition-colors">
                  {getActivityIcon(act.activity_type)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {act.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatDate(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {act.module_title}
                  </p>
                  <p className="text-[11px] text-slate-500">
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
