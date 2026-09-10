import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'saffron' | 'danger' | 'outline' | 'ghost';
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
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-civic-900 text-white hover:bg-civic-800 active:bg-civic-950 focus-visible:ring-civic-800 shadow-civic-xs hover:shadow-civic-sm',
    secondary:
      'border border-civic-300 bg-white text-civic-900 hover:bg-civic-50 hover:border-civic-400 active:bg-civic-100 focus-visible:ring-civic-800 shadow-civic-xs',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-600 shadow-civic-xs hover:shadow-civic-sm',
    warning:
      'bg-saffron-600 text-white hover:bg-saffron-700 active:bg-saffron-800 focus-visible:ring-saffron-600 shadow-civic-xs hover:shadow-civic-sm',
    saffron:
      'bg-saffron-600 text-white hover:bg-saffron-700 active:bg-saffron-800 focus-visible:ring-saffron-600 shadow-civic-xs hover:shadow-civic-sm',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600 shadow-civic-xs',
    outline:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus-visible:ring-civic-800 shadow-civic-xs',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-civic-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-caption font-medium gap-1.5 min-h-[32px]',
    md: 'px-6 py-2.5 text-btn font-medium gap-2 min-h-[44px]',
    lg: 'px-8 py-3 text-body font-semibold gap-2 min-h-[48px]',
    icon: 'p-2.5 min-w-[40px] min-h-[40px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
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
    </button>
  );
};

export default Button;
