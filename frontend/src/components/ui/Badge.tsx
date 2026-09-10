import React from 'react';

export type BadgeVariant =
  | 'certified'
  | 'completed'
  | 'success'
  | 'pass'
  | 'warning'
  | 'attention'
  | 'in-progress'
  | 'in_progress'
  | 'civic'
  | 'info'
  | 'danger'
  | 'error'
  | 'critical'
  | 'fail'
  | 'failed'
  | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const styles: Record<BadgeVariant, { bg: string; dot: string }> = {
    certified: { bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold', dot: 'bg-emerald-600' },
    completed: { bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold', dot: 'bg-emerald-600' },
    success: { bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80', dot: 'bg-emerald-600' },
    pass: { bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80', dot: 'bg-emerald-600' },
    warning: { bg: 'bg-saffron-50 text-saffron-800 border border-saffron-200/80', dot: 'bg-saffron-600' },
    attention: { bg: 'bg-saffron-50 text-saffron-800 border border-saffron-200/80 font-semibold', dot: 'bg-saffron-600' },
    'in-progress': { bg: 'bg-civic-50 text-civic-800 border border-civic-200/80', dot: 'bg-civic-600 animate-pulse' },
    in_progress: { bg: 'bg-civic-50 text-civic-800 border border-civic-200/80', dot: 'bg-civic-600 animate-pulse' },
    civic: { bg: 'bg-civic-50 text-civic-800 border border-civic-200/80', dot: 'bg-civic-600' },
    info: { bg: 'bg-civic-50 text-civic-800 border border-civic-200/80', dot: 'bg-civic-600' },
    danger: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    error: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    critical: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    fail: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    failed: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    neutral: { bg: 'bg-slate-100 text-slate-700 border border-slate-200', dot: 'bg-slate-500' },
  };

  const currentStyle = styles[variant] || styles.info;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-micro gap-1',
    md: 'px-2.5 py-1 text-micro gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center text-micro font-semibold uppercase tracking-wider rounded-full ${sizeStyles[size]} ${currentStyle.bg} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentStyle.dot}`} />}
      {children}
    </span>
  );
};

export default Badge;
