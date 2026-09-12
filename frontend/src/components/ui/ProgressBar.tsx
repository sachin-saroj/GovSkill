import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'mint' | 'cyan';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((normalizedValue / max) * 100);

  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantStyles = {
    primary: 'bg-[#0A0A0A]',
    success: 'bg-emerald-600 bg-[#2A5B4A]',
    warning: 'bg-[#C9A24A]',
    danger: 'bg-[#C97B5A]',
    mint: 'bg-[#2A5B4A]',
    cyan: 'bg-[#C9A24A]',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-[13px] font-sans font-medium text-[#6B6357]">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-[12px] font-bold tabular-nums text-[#0A0A0A]">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={`w-full bg-[#EDE4D0] border border-[#D9CFBB]/80 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        <motion.div
          initial={{ width: shouldReduceMotion ? `${percentage}%` : '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full transition-colors ${variantStyles[variant]}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
