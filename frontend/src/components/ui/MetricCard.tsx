import React from 'react';
import Card from './Card';
import TrendIndicator from './TrendIndicator';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  context?: string;
  prefix?: string;
  suffix?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string | number;
    label?: string;
    invertColors?: boolean;
  };
  dark?: boolean;
  variant?: 'default' | 'sage' | 'azure' | 'gold' | 'rose' | 'inverted';
  cornerBrackets?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  context,
  prefix = '',
  suffix = '',
  trend,
  dark = false,
  variant,
  cornerBrackets = false,
  className = '',
  ...props
}) => {
  // Map variant to Card variant
  let cardVariant: 'default' | 'inverted' | 'metric' | 'kpi-sage' | 'kpi-azure' | 'kpi-gold' | 'kpi-rose' = 'metric';
  if (dark || variant === 'inverted') {
    cardVariant = 'inverted';
  } else if (variant === 'sage') {
    cardVariant = 'kpi-sage';
  } else if (variant === 'azure') {
    cardVariant = 'kpi-azure';
  } else if (variant === 'gold') {
    cardVariant = 'kpi-gold';
  } else if (variant === 'rose') {
    cardVariant = 'kpi-rose';
  }

  const isDark = cardVariant === 'inverted';

  return (
    <Card
      variant={cardVariant}
      cornerBrackets={cornerBrackets}
      className={`flex flex-col justify-between ${className}`}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.16em] font-medium ${
              isDark ? 'text-[#EDE4D0]/60' : 'text-text-muted-aa text-[#6B6357]'
            }`}
          >
            {label}
          </span>
          {trend && (
            <TrendIndicator
              direction={trend.direction}
              value={trend.value}
              label={trend.label}
              invertColors={trend.invertColors}
              size="sm"
            />
          )}
        </div>

        <div
          className={`font-serif text-[clamp(28px,3.5vw,44px)] font-normal leading-tight tracking-[-0.025em] ${
            isDark ? 'text-[#F5EFE0]' : 'text-text-primary text-[#0A0A0A]'
          }`}
          style={{ fontFamily: '"Fraunces", Georgia, serif' }}
        >
          {prefix}
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix}
        </div>
      </div>

      {context && (
        <p
          className={`text-[12.5px] font-sans font-normal leading-relaxed pt-3 mt-3 border-t ${
            isDark
              ? 'border-white/10 text-[#EDE4D0]/50'
              : 'border-border-warm/60 border-[#D9CFBB]/60 text-text-muted-aa text-[#6B6357]'
          }`}
        >
          {context}
        </p>
      )}
    </Card>
  );
};

export default MetricCard;
