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
    certified: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },
    completed: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },
    success: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },
    pass: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },
    warning: { bg: 'bg-[#C9A24A]/15 text-[#7A5B14] border border-[#C9A24A]/40 font-semibold', dot: 'bg-[#C9A24A]' },
    attention: { bg: 'bg-[#C9A24A]/15 text-[#7A5B14] border border-[#C9A24A]/40 font-semibold', dot: 'bg-[#C9A24A]' },
    'in-progress': { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A] animate-pulse' },
    in_progress: { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A] animate-pulse' },
    civic: { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A]' },
    info: { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A]' },
    danger: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    error: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    critical: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    fail: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    failed: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    neutral: { bg: 'bg-[#EFE6D2]/60 text-[#6B6357] border border-[#D9CFBB] font-medium', dot: 'bg-[#6B6357]' },
  };

  const currentStyle = styles[variant] || styles.info;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-[11px] gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-mono uppercase tracking-[0.14em] rounded-full ${sizeStyles[size]} ${currentStyle.bg} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentStyle.dot}`} />}
      {children}
    </span>
  );
};

export default Badge;
