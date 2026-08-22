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
    <Card className="border-slate-200 shadow-civic-sm p-5 space-y-3 bg-white hover:shadow-civic-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className={`p-2.5 rounded-xl ${iconBgClass} ${iconColorClass} shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>

        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-civic-xs ${badgeClasses[badgeVariant]}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <span className="text-xs font-semibold text-slate-500 block mb-1">
          {label}
        </span>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {subtext}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ReadinessMetricCard;
