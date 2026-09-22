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
  cornerBrackets = false,
  className = '',
  ...props
}) => {
  return (
    <Card
      variant={dark ? 'inverted' : 'metric'}
      cornerBrackets={cornerBrackets}
      className={`flex flex-col justify-between ${className}`}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.16em] font-medium ${
              dark ? 'text-[#EDE4D0]/60' : 'text-[#6B6357]'
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
            dark ? 'text-[#F5EFE0]' : 'text-[#0A0A0A]'
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
            dark
              ? 'border-white/10 text-[#EDE4D0]/50'
              : 'border-[#D9CFBB]/60 text-[#6B6357]'
          }`}
        >
          {context}
        </p>
      )}
    </Card>
  );
};

export default MetricCard;
