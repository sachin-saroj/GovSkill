import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    civic: 'bg-civic-50 text-civic-800 border-civic-200',
    saffron: 'bg-saffron-50 text-saffron-900 border-saffron-200',
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <Card className="border-slate-200 shadow-civic-sm p-6 space-y-3.5 bg-white hover:shadow-civic-lg transition-all duration-200 rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div className={`p-3 rounded-2xl ${iconBgClass} ${iconColorClass} shrink-0 shadow-civic-xs`}>
            <Icon className="h-5 w-5" />
          </div>

          {badgeText && (
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-civic-xs ${badgeClasses[badgeVariant]}`}>
              {badgeText}
            </span>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {value}
          </div>
          {subtext && (
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {subtext}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ReadinessMetricCard;
