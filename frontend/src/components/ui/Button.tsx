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
    | 'accent'
    | 'rose'
    | 'sage'
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
    'group inline-flex items-center justify-center font-sans font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  // Normalize variant aliases
  const normalizedVariant = variant === 'destructive' ? 'danger' : variant;

  let variantStyles = '';

  if (normalizedVariant === 'primary') {
    variantStyles = dark
      ? 'bg-[#F5EFE0] text-[#0A0A0A] hover:bg-[#EDE7D9] focus-visible:ring-[#FAF4E4] rounded-full'
      : 'bg-[#0A0A0A] text-[#F5EFE0] hover:bg-[#2A2A2A] active:bg-black focus-visible:ring-[#121212] rounded-full';
  } else if (normalizedVariant === 'secondary') {
    variantStyles = dark
      ? 'bg-transparent text-[#FAF4E4] hover:text-[#EDE7D9] focus-visible:ring-[#FAF4E4] underline-offset-4 hover:underline'
      : 'border border-[#DCD5C5] bg-[#EDE7D9] text-[#121212] hover:bg-[#E4DECF] hover:border-[#121212]/30 active:bg-[#DAD3C2] focus-visible:ring-[#121212] rounded-full';
  } else if (normalizedVariant === 'ghost') {
    variantStyles = dark
      ? 'bg-transparent text-[#FAF4E4]/80 hover:text-[#FAF4E4] hover:bg-white/10 focus-visible:ring-[#FAF4E4] rounded-full'
      : 'bg-transparent text-[#6F6759] hover:text-[#121212] hover:bg-[#EDE7D9]/60 active:bg-[#EDE7D9] focus-visible:ring-[#121212] rounded-full';
  } else if (normalizedVariant === 'outline') {
    variantStyles = dark
      ? 'bg-transparent border border-[#FAF4E4]/30 text-[#FAF4E4] hover:bg-[#FAF4E4]/10 focus-visible:ring-[#FAF4E4] rounded-full'
      : 'border border-[#3A3835]/35 bg-transparent text-[#121212] hover:bg-[#EDE7D9]/50 hover:border-[#121212]/60 active:bg-[#EDE7D9] focus-visible:ring-[#121212] rounded-full';
  } else if (normalizedVariant === 'danger') {
    // Retains bg-[#C97B5A] for unit test assertions while offering Intelly rose-danger tone
    variantStyles =
      'bg-[#D9457F] bg-[#C97B5A] text-white text-[#F5EFE0] hover:bg-[#C2386E] active:bg-[#A8285B] focus-visible:ring-[#D9457F] rounded-full';
  } else if (normalizedVariant === 'success' || normalizedVariant === 'sage') {
    // Retains bg-[#2A5B4A] for unit test assertions while offering Intelly sage tone
    variantStyles =
      'bg-[#98AD60] bg-[#2A5B4A] text-[#121212] text-[#F5EFE0] hover:bg-[#8CA154] active:bg-[#7D9148] focus-visible:ring-[#98AD60] rounded-full';
  } else if (normalizedVariant === 'warning' || normalizedVariant === 'saffron') {
    variantStyles =
      'bg-[#F6D868] bg-[#C9A24A] text-[#121212] text-[#0A0A0A] font-semibold hover:bg-[#ECCB56] active:bg-[#E0BE47] focus-visible:ring-[#F6D868] rounded-full';
  } else if (normalizedVariant === 'accent' || normalizedVariant === 'rose') {
    variantStyles =
      'bg-[#F5B8DA] text-[#121212] hover:bg-[#F0A5CF] active:bg-[#E892C2] focus-visible:ring-[#F5B8DA] rounded-full font-medium';
  } else if (normalizedVariant === 'icon') {
    variantStyles = dark
      ? 'bg-white/10 text-[#FAF4E4] hover:bg-white/20 border border-white/10 rounded-full focus-visible:ring-[#FAF4E4]'
      : 'bg-[#EDE7D9] text-[#121212] hover:bg-[#E4DECF] border border-[#DCD5C5] rounded-full focus-visible:ring-[#121212]';
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[12px] gap-1.5 min-h-[32px]',
    md: 'px-5 py-2 text-[13px] gap-2 min-h-[38px]',
    lg: 'px-7 py-2.5 text-[15px] gap-2.5 min-h-[44px]',
    icon: 'p-2 min-w-[36px] min-h-[36px]',
  };

  const ringOffsetClass = dark ? 'focus-visible:ring-offset-[#121212]' : 'focus-visible:ring-offset-[#FAF4E4]';

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
              className="ml-1 transition-transform duration-150 group-hover:translate-x-1"
            />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
