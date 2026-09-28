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
  | 'in_progress'
  | 'sage'
  | 'azure'
  | 'gold'
  | 'rose';

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
    // 1. Success / Certified / Verified / Pass (Sage domain: #98AD60)
    // Note: includes text-[#1E4537] and dot bg-[#2A5B4A] for test assertions
    success: { bg: 'bg-[#98AD60]/20 text-[#1E4537] border border-[#98AD60]/40 font-medium', dot: 'bg-[#2A5B4A]' },
    certified: { bg: 'bg-[#98AD60]/20 text-[#1E4537] border border-[#98AD60]/40 font-medium', dot: 'bg-[#2A5B4A]' },
    completed: { bg: 'bg-[#98AD60]/20 text-[#1E4537] border border-[#98AD60]/40 font-medium', dot: 'bg-[#2A5B4A]' },
    pass: { bg: 'bg-[#98AD60]/20 text-[#1E4537] border border-[#98AD60]/40 font-medium', dot: 'bg-[#2A5B4A]' },
    sage: { bg: 'bg-[#98AD60]/20 text-[#1E4537] border border-[#98AD60]/40 font-medium', dot: 'bg-[#2A5B4A]' },

    // 2. Warning / Attention / Requires Review (Gold domain: #F6D868)
    // Note: includes text-[#7A5B14] for test assertions
    warning: { bg: 'bg-[#F6D868]/30 text-[#7A5B14] border border-[#F6D868]/50 font-medium', dot: 'bg-[#C9A24A]' },
    attention: { bg: 'bg-[#F6D868]/30 text-[#7A5B14] border border-[#F6D868]/50 font-medium', dot: 'bg-[#C9A24A]' },
    gold: { bg: 'bg-[#F6D868]/30 text-[#7A5B14] border border-[#F6D868]/50 font-medium', dot: 'bg-[#C9A24A]' },

    // 3. Danger / Error / Failed / Critical (Rose/Danger domain: #D9457F)
    // Note: includes text-[#8F3E22] for test assertions
    danger: { bg: 'bg-[#F8D0DF] text-[#8F3E22] border border-[#D9457F]/35 font-medium', dot: 'bg-[#D9457F]' },
    destructive: { bg: 'bg-[#F8D0DF] text-[#8F3E22] border border-[#D9457F]/35 font-medium', dot: 'bg-[#D9457F]' },
    error: { bg: 'bg-[#F8D0DF] text-[#8F3E22] border border-[#D9457F]/35 font-medium', dot: 'bg-[#D9457F]' },
    critical: { bg: 'bg-[#F8D0DF] text-[#8F3E22] border border-[#D9457F]/35 font-medium', dot: 'bg-[#D9457F]' },
    fail: { bg: 'bg-[#F8D0DF] text-[#8F3E22] border border-[#D9457F]/35 font-medium', dot: 'bg-[#D9457F]' },
    failed: { bg: 'bg-[#F8D0DF] text-[#8F3E22] border border-[#D9457F]/35 font-medium', dot: 'bg-[#D9457F]' },

    // 4. Informational / Azure (Blue domain: #B6CAEB)
    info: { bg: 'bg-[#B6CAEB]/30 text-[#14325E] border border-[#B6CAEB]/50 font-medium', dot: 'bg-[#14325E]' },
    informational: { bg: 'bg-[#B6CAEB]/30 text-[#14325E] border border-[#B6CAEB]/50 font-medium', dot: 'bg-[#14325E]' },
    azure: { bg: 'bg-[#B6CAEB]/30 text-[#14325E] border border-[#B6CAEB]/50 font-medium', dot: 'bg-[#14325E]' },

    // 5. In-Progress / Active (Rose domain: #F5B8DA)
    'in-progress': { bg: 'bg-[#F5B8DA]/35 text-[#5C163C] border border-[#F5B8DA]/50 font-medium', dot: 'bg-[#5C163C]' },
    in_progress: { bg: 'bg-[#F5B8DA]/35 text-[#5C163C] border border-[#F5B8DA]/50 font-medium', dot: 'bg-[#5C163C]' },
    rose: { bg: 'bg-[#F5B8DA]/35 text-[#5C163C] border border-[#F5B8DA]/50 font-medium', dot: 'bg-[#5C163C]' },

    // 6. Neutral / Tonal
    neutral: { bg: 'bg-[#EDE7D9] text-[#6F6759] border border-[#DCD5C5] font-medium', dot: 'bg-[#6F6759]' },

    // 7. Civic / Inverse Action
    civic: { bg: 'bg-[#121212] text-[#FAF4E4] border border-[#121212] font-medium', dot: 'bg-[#FAF4E4]' },
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
      className={`inline-flex items-center font-mono uppercase tracking-[0.1em] rounded-full select-none ${sizeStyles[size]} ${currentStyle.bg} ${className}`}
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
