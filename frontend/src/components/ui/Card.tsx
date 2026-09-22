import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?:
    | 'default'
    | 'structural'
    | 'interactive'
    | 'elevated'
    | 'feature'
    | 'inverted'
    | 'stage'
    | 'metric'
    | 'subtle'
    | 'floating'
    | 'testimonial';
  cornerBrackets?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  cornerBrackets = false,
  noPadding = false,
  ...props
}) => {
  // Map variant aliases to the controlled hierarchy tiers
  const normalizedVariant =
    variant === 'default'
      ? 'structural'
      : variant === 'stage'
      ? 'inverted'
      : variant === 'floating'
      ? 'feature'
      : variant;

  const variantStyles = {
    // 1. Structural card: clean boundary, subtle frame, warm neutral containment
    structural:
      'bg-[#EDE4D0]/65 border border-[#D9CFBB] shadow-[0_12px_32px_-12px_rgba(10,10,10,0.06)] rounded-[20px] text-[#0A0A0A]',

    // 2. Elevated/interactive card: hover elevation, smooth tactile feedback
    interactive:
      'bg-[#EDE4D0]/65 border border-[#D9CFBB] shadow-[0_12px_32px_-12px_rgba(10,10,10,0.06)] hover:bg-[#EDE4D0]/90 hover:border-[#0A0A0A]/30 hover:shadow-[0_20px_40px_-15px_rgba(10,10,10,0.12)] transition-all duration-200 cursor-pointer rounded-[20px] text-[#0A0A0A]',

    // 3. Elevated surface
    elevated:
      'bg-[#EDE4D0] border border-[#D9CFBB] shadow-[0_16px_40px_-15px_rgba(10,10,10,0.09)] rounded-[24px] text-[#0A0A0A]',

    // 4. Editorial feature surface: generous presence, richer paper tint
    feature:
      'bg-[#EDE4D0]/85 border border-[#D9CFBB] shadow-[0_20px_48px_-15px_rgba(10,10,10,0.08)] rounded-[28px] text-[#0A0A0A]',

    // 5. Inverted/dark surface: deep ink #111111 for authoritative stage moments
    inverted:
      'bg-[#111111] border border-white/10 text-[#F5EFE0] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] rounded-[28px]',

    // 6. Metric surface: dedicated container for key stats and KPIs
    metric:
      'bg-[#EDE4D0]/65 border border-[#D9CFBB] shadow-[0_12px_32px_-12px_rgba(10,10,10,0.06)] hover:border-[#C9A24A]/60 transition-colors rounded-[20px] text-[#0A0A0A]',

    // 7. Subtle surface: lightweight grouping
    subtle:
      'bg-[#EFE6D2]/50 border border-[#D9CFBB]/70 shadow-none rounded-[16px] text-[#0A0A0A]',

    // 8. Testimonial surface
    testimonial:
      'bg-[#191919] text-[#F5EFE0] border border-white/10 rounded-[28px] shadow-lg',
  }[normalizedVariant];

  const paddingStyle = noPadding
    ? ''
    : normalizedVariant === 'feature' || normalizedVariant === 'inverted'
    ? 'p-6 sm:p-8 lg:p-10'
    : 'p-5 sm:p-6';

  const isDark = normalizedVariant === 'inverted';

  return (
    <div
      className={`relative ${variantStyles} ${paddingStyle} ${className}`}
      {...props}
    >
      {cornerBrackets && (
        <>
          <span
            className={`absolute top-2 left-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${
              isDark ? 'text-white/20' : 'text-[#6B6357]/40'
            }`}
            aria-hidden="true"
          >
            ┌
          </span>
          <span
            className={`absolute top-2 right-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${
              isDark ? 'text-white/20' : 'text-[#6B6357]/40'
            }`}
            aria-hidden="true"
          >
            ┐
          </span>
          <span
            className={`absolute bottom-2 left-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${
              isDark ? 'text-white/20' : 'text-[#6B6357]/40'
            }`}
            aria-hidden="true"
          >
            └
          </span>
          <span
            className={`absolute bottom-2 right-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${
              isDark ? 'text-white/20' : 'text-[#6B6357]/40'
            }`}
            aria-hidden="true"
          >
            ┘
          </span>
        </>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`flex flex-col space-y-1 pb-4 border-b border-[#D9CFBB]/60 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`font-serif text-[18px] sm:text-[21px] font-normal tracking-[-0.02em] text-current ${className}`}
    style={{ fontFamily: '"Fraunces", Georgia, serif' }}
    {...props}
  >
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
  <div className={`flex items-center justify-between pt-4 mt-4 border-t border-[#D9CFBB]/60 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
