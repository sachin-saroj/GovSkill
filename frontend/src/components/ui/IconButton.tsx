import React from 'react';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'rose' | 'azure';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // Required for WCAG 2.1 AA accessibility on icon-only controls
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: 'bg-ink text-surface-light hover:bg-[#252525] active:bg-[#000000] border-transparent',
  secondary: 'bg-surface text-text-primary hover:bg-surface-light active:bg-border-warm border-transparent',
  outline: 'bg-transparent text-text-primary border-border-warm hover:border-border-strong hover:bg-surface/50 active:bg-surface',
  ghost: 'bg-transparent text-text-primary hover:bg-surface active:bg-surface-strong border-transparent',
  rose: 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200/50',
  azure: 'bg-azure-100 text-azure-800 hover:bg-azure-200 border-azure-200/50',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8 min-w-[32px] text-[13px]',
  md: 'w-9 h-9 min-w-[36px] text-[15px]',
  lg: 'w-11 h-11 min-w-[44px] text-[18px]',
};

/**
 * IconButton
 * Accessible, circular touch-target control for icon-only actions (navigation, filters, dismissal).
 * Enforces mandatory aria-label for screen reader users.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-full border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.97] ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
