import React from 'react';
import { motion, useReducedMotion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { springTactile } from '@/lib/motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'saffron' | 'ink' | 'marigold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = disabled || isLoading;

  // Single transform owner: No CSS active:scale-* classes. Framer Motion handles tactile scaling exclusively.
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-civic-700 text-white hover:bg-civic-800 active:bg-civic-900 focus-visible:ring-civic-700 shadow-civic-sm hover:shadow-civic-md',
    secondary:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-600 shadow-civic-sm',
    danger:
      'bg-danger text-white hover:bg-danger-hover active:bg-[#782319] focus-visible:ring-danger shadow-civic-sm',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 focus-visible:ring-civic-700 shadow-civic-xs',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-civic-700',
    saffron:
      'bg-saffron-600 text-white hover:bg-saffron-700 active:bg-saffron-800 focus-visible:ring-saffron-600 shadow-civic-sm',
    ink:
      'bg-ink text-white hover:bg-slate-900 active:bg-black focus-visible:ring-ink shadow-civic-sm',
    marigold:
      'bg-marigold text-white hover:bg-amber-600 active:bg-amber-700 focus-visible:ring-marigold shadow-civic-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[32px]',
    md: 'px-4 py-2 text-sm gap-2 min-h-[38px]',
    lg: 'px-6 py-2.5 text-base gap-2.5 min-h-[46px]',
    icon: 'p-2 min-w-[36px] min-h-[36px]',
  };

  return (
    <motion.button
      whileHover={isDisabled || shouldReduceMotion ? undefined : { scale: 1.01 }}
      whileTap={isDisabled || shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={springTactile}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      {...(props as HTMLMotionProps<'button'>)}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
