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
    <Card className="border border-border-warm p-6 space-y-3.5 bg-surface hover:border-ink/20 transition-all duration-200 rounded-2xl shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className={`p-3 rounded-xl shrink-0 border border-border-warm ${iconBgClass || 'bg-surface-light'} ${iconColorClass || 'text-ink'}`}>
          <Icon className="h-5 w-5" />
        </div>

        {badgeText && (
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            badgeVariant === 'emerald'
              ? 'bg-sage-500/15 text-sage-900 border-sage-500/30'
              : badgeVariant === 'saffron'
              ? 'bg-gold-500/15 text-gold-900 border-gold-500/30'
              : 'bg-azure-500/10 text-azure-900 border-azure-500/25'
          }`}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted font-bold block mb-1">
          {label}
        </span>
        <div className="font-mono text-3xl font-black text-ink tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-ink-muted font-sans font-medium mt-1">
            {subtext}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ReadinessMetricCard;
