import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'pass'
  | 'danger'
  | 'fail'
  | 'failed'
  | 'warning'
  | 'info'
  | 'certified'
  | 'in-progress'
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
    success: { bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80', dot: 'bg-emerald-600' },
    pass: { bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80', dot: 'bg-emerald-600' },
    danger: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    fail: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    failed: { bg: 'bg-red-50 text-red-800 border border-red-200/80', dot: 'bg-red-600' },
    warning: { bg: 'bg-amber-50 text-amber-800 border border-amber-200/80', dot: 'bg-amber-600' },
    info: { bg: 'bg-civic-50 text-civic-800 border border-civic-200/80', dot: 'bg-civic-600' },
    certified: { bg: 'bg-saffron-50 text-saffron-900 border border-saffron-300 font-semibold', dot: 'bg-saffron-600' },
    'in-progress': { bg: 'bg-blue-50 text-blue-700 border border-blue-200', dot: 'bg-blue-500 animate-pulse' },
    neutral: { bg: 'bg-slate-100 text-slate-700 border border-slate-200', dot: 'bg-slate-500' },
  };

  const currentStyle = styles[variant] || styles.info;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${currentStyle.bg} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentStyle.dot}`} />}
      {children}
    </span>
  );
};

export default Badge;
