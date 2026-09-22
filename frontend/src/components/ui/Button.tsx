import React from 'react';
import { IconSpinner, IconArrowRight } from './icons';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'outline'
    | 'danger'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'saffron'
    | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  dark?: boolean;
  isLoading?: boolean;
  arrow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dark = false,
  isLoading = false,
  arrow,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const hasArrow = arrow ?? (variant === 'secondary');
  const baseStyles =
    'group inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  // Normalize variant aliases
  const normalizedVariant = variant === 'destructive' ? 'danger' : variant;

  let variantStyles = '';

  if (normalizedVariant === 'primary') {
    variantStyles = dark
      ? 'bg-[#F5EFE0] text-[#0A0A0A] hover:bg-[#EDE4D0] focus-visible:ring-[#F5EFE0] rounded-full shadow-sm hover:shadow-md'
      : 'bg-[#0A0A0A] text-[#F5EFE0] hover:bg-[#222222] active:bg-[#000000] focus-visible:ring-[#0A0A0A] rounded-full shadow-sm hover:shadow-md';
  } else if (normalizedVariant === 'secondary') {
    variantStyles = dark
      ? 'bg-transparent text-[#F5EFE0] hover:text-[#EDE4D0] focus-visible:ring-[#F5EFE0] underline-offset-4 hover:underline'
      : 'border border-[#D9CFBB] bg-[#EDE4D0]/70 text-[#0A0A0A] hover:bg-[#EDE4D0] hover:border-[#0A0A0A]/40 active:bg-[#E2D7C0] focus-visible:ring-[#0A0A0A] rounded-full shadow-xs';
  } else if (normalizedVariant === 'ghost') {
    variantStyles = dark
      ? 'bg-transparent text-[#EDE4D0]/80 hover:text-[#F5EFE0] hover:bg-white/10 focus-visible:ring-[#F5EFE0] rounded-full'
      : 'bg-transparent text-[#6B6357] hover:text-[#0A0A0A] hover:bg-[#EDE4D0]/50 active:bg-[#EDE4D0]/80 focus-visible:ring-[#0A0A0A] rounded-full';
  } else if (normalizedVariant === 'outline') {
    variantStyles = dark
      ? 'bg-transparent border border-[#EDE4D0]/30 text-[#F5EFE0] hover:bg-[#F5EFE0]/10 focus-visible:ring-[#F5EFE0] rounded-full'
      : 'border border-[#D9CFBB] bg-transparent text-[#0A0A0A] hover:bg-[#EDE4D0]/50 hover:border-[#0A0A0A]/40 active:bg-[#EDE4D0] focus-visible:ring-[#0A0A0A] rounded-full';
  } else if (normalizedVariant === 'danger') {
    variantStyles =
      'bg-[#C97B5A] text-[#F5EFE0] hover:bg-[#B56A49] active:bg-[#A05938] focus-visible:ring-[#C97B5A] rounded-full shadow-sm';
  } else if (normalizedVariant === 'success') {
    variantStyles =
      'bg-[#2A5B4A] text-[#F5EFE0] hover:bg-[#1E4235] active:bg-[#153026] focus-visible:ring-[#2A5B4A] rounded-full shadow-sm';
  } else if (normalizedVariant === 'warning' || normalizedVariant === 'saffron') {
    variantStyles =
      'bg-[#C9A24A] text-[#0A0A0A] font-semibold hover:bg-[#B8923B] active:bg-[#A8822E] focus-visible:ring-[#C9A24A] rounded-full shadow-sm';
  } else if (normalizedVariant === 'icon') {
    variantStyles = dark
      ? 'bg-white/10 text-[#F5EFE0] hover:bg-white/20 border border-white/10 rounded-full focus-visible:ring-[#F5EFE0]'
      : 'bg-[#EDE4D0]/70 text-[#0A0A0A] hover:bg-[#EDE4D0] border border-[#D9CFBB] rounded-full focus-visible:ring-[#0A0A0A]';
  }

  const sizes = {
    sm: 'px-3.5 py-1.5 text-[13px] gap-1.5 min-h-[34px]',
    md: 'px-6 py-2.5 text-[14px] gap-2 min-h-[44px]',
    lg: 'px-8 py-3.5 text-[16px] gap-2.5 min-h-[48px]',
    icon: 'p-2.5 min-w-[40px] min-h-[40px]',
  };

  const ringOffsetClass = dark ? 'focus-visible:ring-offset-[#111111]' : 'focus-visible:ring-offset-[#F5EFE0]';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizes[size]} ${ringOffsetClass} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <IconSpinner size={size === 'sm' ? 'xs' : 'sm'} />
          <span>{children || 'Processing…'}</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          {hasArrow && (
            <IconArrowRight
              size="sm"
              className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
            />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
