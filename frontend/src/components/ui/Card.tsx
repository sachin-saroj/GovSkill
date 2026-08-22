import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive' | 'subtle';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  noPadding = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/90 shadow-civic-xs',
    elevated: 'bg-white border border-slate-200 shadow-civic-md',
    interactive:
      'bg-white border border-slate-200 shadow-civic-xs hover:shadow-civic-md hover:border-civic-300 transition-all duration-200 cursor-pointer',
    subtle: 'bg-slate-50/70 border border-slate-200/80 shadow-none',
  };

  const paddingStyle = noPadding ? '' : 'p-6';

  return (
    <div
      className={`rounded-xl ${variantStyles[variant]} ${paddingStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`flex flex-col space-y-1.5 pb-4 border-b border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base sm:text-lg font-semibold text-slate-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs sm:text-sm text-slate-500 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => <div className={`pt-4 ${className}`} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`flex items-center justify-between pt-4 mt-4 border-t border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
