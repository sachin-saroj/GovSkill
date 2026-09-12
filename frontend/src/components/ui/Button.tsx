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
      'bg-[#0A0A0A] text-[#F5EFE0] hover:bg-[#222222] active:bg-[#000000] focus-visible:ring-[#0A0A0A] shadow-sm hover:shadow-md',
    secondary:
      'border border-[#D9CFBB] bg-[#EDE4D0]/70 text-[#0A0A0A] hover:bg-[#EDE4D0] hover:border-[#0A0A0A]/40 active:bg-[#E2D7C0] focus-visible:ring-[#0A0A0A] shadow-xs',
    success:
      'bg-[#2A5B4A] text-[#F5EFE0] hover:bg-[#1E4235] active:bg-[#153026] focus-visible:ring-[#2A5B4A] shadow-sm',
    warning:
      'bg-[#C9A24A] text-[#0A0A0A] font-semibold hover:bg-[#B8923B] active:bg-[#A8822E] focus-visible:ring-[#C9A24A] shadow-sm',
    saffron:
      'bg-[#C9A24A] text-[#0A0A0A] font-semibold hover:bg-[#B8923B] active:bg-[#A8822E] focus-visible:ring-[#C9A24A] shadow-sm',
    danger:
      'bg-[#C97B5A] text-[#F5EFE0] hover:bg-[#B56A49] active:bg-[#A05938] focus-visible:ring-[#C97B5A] shadow-sm',
    outline:
      'border border-[#D9CFBB] bg-transparent text-[#0A0A0A] hover:bg-[#EDE4D0]/50 hover:border-[#0A0A0A]/40 active:bg-[#EDE4D0] focus-visible:ring-[#0A0A0A]',
    ghost:
      'bg-transparent text-[#6B6357] hover:text-[#0A0A0A] hover:bg-[#EDE4D0]/40 active:bg-[#EDE4D0]/70 focus-visible:ring-[#0A0A0A]',
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
