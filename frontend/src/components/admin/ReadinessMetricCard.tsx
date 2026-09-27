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
  iconColorClass,
  iconBgClass,
  label,
  value,
  subtext,
  badgeText,
  badgeVariant,
}) => {
  return (
    <Card className="border border-[#E4E4E7] p-6 space-y-3.5 bg-white hover:border-[#A1A1AA] transition-all duration-200 rounded-none shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className={`p-3 shrink-0 border border-[#E4E4E7] ${iconBgClass || 'bg-[#FAFAFA]'} ${iconColorClass || 'text-[#09090B]'}`}>
          <Icon className="h-5 w-5" />
        </div>

        {badgeText && (
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 border ${
            badgeVariant === 'emerald'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : badgeVariant === 'saffron'
              ? 'bg-orange-50 text-[#AF411E] border-orange-200'
              : 'bg-[#FAFAFA] text-[#71717A] border-[#E4E4E7]'
          }`}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] font-bold block mb-1">
          {label}
        </span>
        <div className="font-mono text-3xl font-black text-[#09090B] tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-[#52525B] font-sans font-medium mt-1">
            {subtext}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ReadinessMetricCard;
