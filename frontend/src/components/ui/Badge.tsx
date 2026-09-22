import React from 'react';

export type BadgeVariant =
  | 'neutral'
  | 'success'
  | 'certified'
  | 'completed'
  | 'pass'
  | 'warning'
  | 'attention'
  | 'danger'
  | 'destructive'
  | 'error'
  | 'critical'
  | 'fail'
  | 'failed'
  | 'info'
  | 'informational'
  | 'civic'
  | 'in-progress'
  | 'in_progress';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulseDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  dot = false,
  pulseDot = false,
  className = '',
  ...props
}) => {
  const styles: Record<string, { bg: string; dot: string }> = {
    // 1. Success / Certified / Verified / Pass
    success: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },
    certified: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },
    completed: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },
    pass: { bg: 'bg-[#2A5B4A]/12 text-[#1E4537] border border-[#2A5B4A]/30 font-semibold', dot: 'bg-[#2A5B4A]' },

    // 2. Warning / Attention / Requires Review
    warning: { bg: 'bg-[#C9A24A]/15 text-[#7A5B14] border border-[#C9A24A]/40 font-semibold', dot: 'bg-[#C9A24A]' },
    attention: { bg: 'bg-[#C9A24A]/15 text-[#7A5B14] border border-[#C9A24A]/40 font-semibold', dot: 'bg-[#C9A24A]' },

    // 3. Danger / Error / Failed / Critical
    danger: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    destructive: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    error: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    critical: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    fail: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },
    failed: { bg: 'bg-[#C97B5A]/15 text-[#8F3E22] border border-[#C97B5A]/40 font-semibold', dot: 'bg-[#C97B5A]' },

    // 4. Informational / In Progress / Civic
    info: { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A]' },
    informational: { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A]' },
    civic: { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A]' },
    'in-progress': { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A]' },
    in_progress: { bg: 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] font-medium', dot: 'bg-[#0A0A0A]' },

    // 5. Neutral
    neutral: { bg: 'bg-[#EFE6D2]/60 text-[#6B6357] border border-[#D9CFBB] font-medium', dot: 'bg-[#6B6357]' },
  };

  const currentStyle = styles[variant] || styles.info;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-[11px] gap-1.5',
    lg: 'px-3 py-1.5 text-[12px] gap-2',
  };

  const isPulsing = pulseDot || variant === 'in-progress' || variant === 'in_progress';

  return (
    <span
      className={`inline-flex items-center font-mono uppercase tracking-[0.14em] rounded-full select-none ${sizeStyles[size]} ${currentStyle.bg} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentStyle.dot} ${
            isPulsing ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
