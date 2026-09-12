import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive' | 'subtle' | 'feature' | 'inverted' | 'metric';
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
    default: 'bg-[#EDE4D0]/65 border border-[#D9CFBB] shadow-[0_12px_32px_-12px_rgba(10,10,10,0.06)] rounded-2xl',
    feature: 'bg-[#EDE4D0]/85 border border-[#D9CFBB] shadow-[0_20px_48px_-15px_rgba(10,10,10,0.08)] rounded-2xl',
    elevated: 'bg-[#EDE4D0] border border-[#D9CFBB] shadow-[0_16px_40px_-15px_rgba(10,10,10,0.09)] rounded-2xl',
    interactive:
      'bg-[#EDE4D0]/65 border border-[#D9CFBB] shadow-[0_12px_32px_-12px_rgba(10,10,10,0.06)] hover:bg-[#EDE4D0]/90 hover:border-[#0A0A0A]/30 hover:shadow-[0_20px_40px_-15px_rgba(10,10,10,0.12)] transition-all duration-200 cursor-pointer rounded-2xl',
    subtle: 'bg-[#EFE6D2]/50 border border-[#D9CFBB]/70 shadow-none rounded-2xl',
    inverted: 'bg-[#0A0A0A] border border-[#222222] text-[#F5EFE0] shadow-[0_16px_40px_-15px_rgba(0,0,0,0.3)] rounded-2xl',
    metric: 'bg-[#EDE4D0]/65 border border-[#D9CFBB] shadow-[0_12px_32px_-12px_rgba(10,10,10,0.06)] hover:border-[#C9A24A]/60 transition-colors rounded-2xl',
  };

  const paddingStyle = noPadding ? '' : variant === 'feature' ? 'p-6 sm:p-8' : 'p-5 sm:p-6';

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyle} ${className}`}
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
  <div className={`flex flex-col space-y-1 pb-4 border-b border-[#D9CFBB]/70 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`font-serif text-[18px] sm:text-[20px] font-normal text-[#0A0A0A] tracking-[-0.02em] ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-[13px] font-normal text-[#6B6357] leading-relaxed ${className}`} {...props}>
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
  <div className={`flex items-center justify-between pt-4 mt-4 border-t border-[#D9CFBB]/70 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
