import React from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

const baseIcon = (
  Component: (props: { className: string }) => JSX.Element
): React.FC<IconProps> => {
  return ({ size = 'md', className = '', ...props }) => {
    const combinedClass = `${sizeMap[size]} shrink-0 transition-transform ${className}`;
    return <Component className={combinedClass} {...(props as any)} />;
  };
};

/**
 * Editorial Directional Arrow
 */
export const IconArrowRight = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
));

export const IconArrowLeft = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M13 8H3M7 12L3 8l4-4" />
  </svg>
));

export const IconChevronDown = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
));

export const IconChevronRight = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M6 4l4 4-4 4" />
  </svg>
));

export const IconCheck = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
));

export const IconClose = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
));

export const IconSearch = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
));

export const IconInfo = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 7.5v3.5M8 5h.01" />
  </svg>
));

export const IconAlertCircle = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 4.5v4M8 11.5h.01" />
  </svg>
));

export const IconAlertTriangle = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M8 2.5l6 10.5H2L8 2.5zM8 7v2.5M8 11.5h.01" />
  </svg>
));

export const IconShield = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M8 2s4 1 5 3v4c0 3.5-3.5 5.5-5 6-1.5-.5-5-2.5-5-6V5c1-2 5-3 5-3z" />
  </svg>
));

export const IconPrinter = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M4 6V2h8v4M4 12H3a1 1 0 01-1-1V7a1 1 0 011-1h10a1 1 0 011 1v4a1 1 0 01-1 1h-1M4 10h8v4H4v-4z" />
  </svg>
));

export const IconExternalLink = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M10 2h4v4M14 2L8 8M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3" />
  </svg>
));

export const IconSpinner = baseIcon(({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`animate-spin ${className}`}
    {...props}
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
));
