import React from 'react';
import Card from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface ReadinessMetricCardProps {
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  label: string;
  value: string | number;
  subtext?: string;
  badgeText?: string;
  badgeVariant?: 'emerald' | 'civic' | 'saffron';
}

export const ReadinessMetricCard: React.FC<ReadinessMetricCardProps> = ({
  icon: Icon,
  iconColorClass = 'text-civic-700',
  iconBgClass = 'bg-civic-50',
  label,
  value,
  subtext,
  badgeText,
  badgeVariant = 'civic',
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    civic: 'bg-civic-50 text-civic-800 border-civic-200',
    saffron: 'bg-saffron-50 text-saffron-900 border-saffron-200',
  };

  return (
    <Card className="border-slate-200 shadow-civic-sm p-6 space-y-3.5 bg-white hover:shadow-civic-md transition-all duration-200 rounded-civic-xl">
      <div className="flex items-start justify-between gap-3">
        <div className={`p-3 rounded-civic-md ${iconBgClass} ${iconColorClass} shrink-0 shadow-civic-xs`}>
          <Icon className="h-5 w-5" />
        </div>

        {badgeText && (
          <span className={`text-micro font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-civic-xs ${badgeClasses[badgeVariant]}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <span className="text-caption font-medium text-slate-500 block mb-1">
          {label}
        </span>
        <div className="text-page-title font-semibold text-slate-900 tracking-tight font-mono">
          {value}
        </div>
        {subtext && (
          <p className="text-caption text-slate-500 font-normal mt-1">
            {subtext}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ReadinessMetricCard;
