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
    <Card className="border-[#D9CFBB] p-6 space-y-3.5 bg-[#EDE4D0] hover:border-[#0A0A0A]/40 transition-all duration-200 rounded-2xl shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className={`p-3 rounded-full shrink-0 shadow-xs border border-[#D9CFBB] ${iconBgClass || 'bg-[#F5EFE0]'} ${iconColorClass || 'text-[#0A0A0A]'}`}>
          <Icon className="h-5 w-5" />
        </div>

        {badgeText && (
          <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            badgeVariant === 'emerald'
              ? 'bg-[#2A5B4A]/10 text-[#2A5B4A] border-[#2A5B4A]/30'
              : badgeVariant === 'saffron'
              ? 'bg-[#C9A24A]/15 text-[#0A0A0A] border-[#C9A24A]/30'
              : 'bg-[#F5EFE0] text-[#6B6357] border-[#D9CFBB]'
          }`}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <span className="text-xs font-mono text-[#6B6357] block mb-1">
          {label}
        </span>
        <div className="font-mono text-3xl font-bold text-[#0A0A0A] tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-[#6B6357] font-sans font-normal mt-1">
            {subtext}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ReadinessMetricCard;
