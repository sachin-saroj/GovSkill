import React from 'react';

export interface TrendIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  direction: 'up' | 'down' | 'neutral';
  value: string | number;
  label?: string;
  invertColors?: boolean; // If lower is better (e.g. error rates)
  size?: 'sm' | 'md';
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  direction,
  value,
  label,
  invertColors = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const isPositive = direction === 'up';
  const isNegative = direction === 'down';
  const isNeutral = direction === 'neutral';

  const isFavorable = invertColors ? isNegative : isPositive;
  const isUnfavorable = invertColors ? isPositive : isNegative;

  let colorClasses = 'text-[#6B6357] bg-[#EDE4D0]/60 border-[#D9CFBB]';
  if (isFavorable) {
    colorClasses = 'text-[#1E4537] bg-[#2A5B4A]/10 border-[#2A5B4A]/30';
  } else if (isUnfavorable) {
    colorClasses = 'text-[#8F3E22] bg-[#C97B5A]/12 border-[#C97B5A]/35';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]';

  const ariaDescription = label
    ? `${label}: ${direction === 'up' ? 'increased by' : direction === 'down' ? 'decreased by' : 'steady at'} ${value}`
    : `${direction} ${value}`;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-medium rounded-full border select-none ${sizeClasses} ${colorClasses} ${className}`}
      aria-label={ariaDescription}
      {...props}
    >
      {isPositive && (
        <svg
          className="w-3 h-3 shrink-0"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9.5V2.5M2.5 6L6 2.5 9.5 6" />
        </svg>
      )}
      {isNegative && (
        <svg
          className="w-3 h-3 shrink-0"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2.5v7M9.5 6L6 9.5 2.5 6" />
        </svg>
      )}
      {isNeutral && (
        <svg
          className="w-3 h-3 shrink-0"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 6h7" />
        </svg>
      )}
      <span className="tabular-nums">{value}</span>
      {label && <span className="font-sans font-normal text-[11px] opacity-75">{label}</span>}
    </span>
  );
};

export default TrendIndicator;
