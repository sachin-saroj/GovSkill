import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'saffron';
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
    'inline-flex items-center justify-center font-medium rounded-civic-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-civic-900 text-white hover:bg-civic-800 active:bg-civic-950 focus-visible:ring-civic-800 shadow-civic-xs hover:shadow-civic-md',
    secondary:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-600 shadow-civic-xs hover:shadow-civic-md',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600 shadow-civic-xs',
    outline:
      'border border-slate-300 bg-white text-civic-900 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus-visible:ring-civic-800 shadow-civic-xs',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-civic-800',
    saffron:
      'bg-saffron-600 text-white hover:bg-saffron-700 active:bg-saffron-800 focus-visible:ring-saffron-600 shadow-civic-xs hover:shadow-civic-md',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-caption gap-1.5 min-h-[32px]',
    md: 'px-4 py-2 text-body gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-body font-semibold gap-2 min-h-[48px]',
    icon: 'p-2 min-w-[36px] min-h-[36px]',
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
