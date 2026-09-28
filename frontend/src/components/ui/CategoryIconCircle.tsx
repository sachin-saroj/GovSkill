import React from 'react';

export type CategoryDomain = 'sage' | 'azure' | 'gold' | 'rose' | 'ink' | 'neutral';

export interface CategoryIconCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  domain?: CategoryDomain;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const domainStyles: Record<CategoryDomain, string> = {
  sage: 'bg-sage-100 text-sage-800 border-sage-200/50',
  azure: 'bg-azure-100 text-azure-800 border-azure-200/50',
  gold: 'bg-gold-100 text-gold-800 border-gold-200/50',
  rose: 'bg-rose-100 text-rose-800 border-rose-200/50',
  ink: 'bg-ink text-surface-light border-ink',
  neutral: 'bg-surface-light text-text-primary border-border-warm',
};

const sizeStyles = {
  sm: 'w-7 h-7 text-[13px]',
  md: 'w-8 h-8 text-[15px]',
  lg: 'w-10 h-10 text-[18px]',
};

/**
 * CategoryIconCircle
 * Reusable Intelly-style circular icon container tinted by pastel domain semantics.
 * Used for section icons, module category markers, file status, and list item badges.
 */
export const CategoryIconCircle: React.FC<CategoryIconCircleProps> = ({
  domain = 'neutral',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shrink-0 border select-none transition-colors ${sizeStyles[size]} ${domainStyles[domain]} ${className}`}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  );
};

export default CategoryIconCircle;
