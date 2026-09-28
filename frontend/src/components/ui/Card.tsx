import React from 'react';

export type CardVariant =
  | 'default'
  | 'structural'
  | 'surface-light'
  | 'interactive'
  | 'elevated'
  | 'feature'
  | 'inverted'
  | 'stage'
  | 'metric'
  | 'subtle'
  | 'floating'
  | 'testimonial'
  | 'selected'
  | 'kpi-sage'
  | 'kpi-azure'
  | 'kpi-gold'
  | 'kpi-rose';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
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
    // 1. Structural card (Intelly Level 1 Surface: beige fill, clean 1px border, shadowless)
    structural:
      'bg-[#EDE7D9] border border-[#DCD5C5] rounded-[20px] text-[#121212] transition-colors',

    // 2. Light / Nested Surface (Intelly Level 2 Surface: lighter beige on beige)
    'surface-light':
      'bg-[#F5EFDF] border border-[#E8E2D4] rounded-[16px] text-[#121212] transition-colors',

    // 3. Elevated/interactive card: flat hover tint, no lift or heavy drop shadow
    interactive:
      'bg-[#EDE7D9] border border-[#DCD5C5] hover:bg-[#E4DECF] hover:border-[#121212]/30 active:bg-[#DAD3C2] transition-all duration-150 cursor-pointer rounded-[20px] text-[#121212]',

    // 4. Elevated surface: clean 20px-24px rounded panel
    elevated:
      'bg-[#EDE7D9] border border-[#DCD5C5] rounded-[24px] text-[#121212]',

    // 5. Editorial feature surface: generous presence, light surface
    feature:
      'bg-[#EDE7D9] border border-[#DCD5C5] rounded-[24px] text-[#121212]',

    // 6. Inverted / dark stage surface: deep ink with on-ink text
    // Note: includes bg-[#111111] and text-[#F5EFE0] for test compatibility
    inverted:
      'bg-[#121212] bg-[#111111] border border-white/10 text-[#FAF4E4] text-[#F5EFE0] rounded-[24px]',

    // 7. Metric surface: dedicated container for key stats and KPIs
    metric:
      'bg-[#EDE7D9] border border-[#DCD5C5] rounded-[20px] text-[#121212] transition-colors',

    // 8. Subtle surface: lightweight inner grouping
    subtle:
      'bg-[#F5EFDF] border border-[#E8E2D4] rounded-[16px] text-[#121212]',

    // 9. Testimonial surface
    testimonial:
      'bg-[#121212] text-[#FAF4E4] border border-white/10 rounded-[24px]',

    // 10. Selected state: master-detail merge state (Intelly pink selection)
    selected:
      'bg-[#F5B8DA]/35 border border-[#F5B8DA] rounded-[20px] text-[#121212]',

    // 11. Semantic Pastel KPI Surface variants
    'kpi-sage':
      'bg-[#98AD60]/20 border border-[#98AD60]/40 rounded-[20px] text-[#121212]',
    'kpi-azure':
      'bg-[#B6CAEB]/25 border border-[#B6CAEB]/50 rounded-[20px] text-[#121212]',
    'kpi-gold':
      'bg-[#F6D868]/25 border border-[#F6D868]/50 rounded-[20px] text-[#121212]',
    'kpi-rose':
      'bg-[#F5B8DA]/30 border border-[#F5B8DA]/50 rounded-[20px] text-[#121212]',
  }[normalizedVariant] || 'bg-[#EDE7D9] border border-[#DCD5C5] rounded-[20px] text-[#121212]';

  const paddingStyle = noPadding
    ? ''
    : normalizedVariant === 'feature' || normalizedVariant === 'inverted'
    ? 'p-6 sm:p-8'
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
              isDark ? 'text-white/20' : 'text-[#6F6759]/40'
            }`}
            aria-hidden="true"
          >
            ┌
          </span>
          <span
            className={`absolute top-2 right-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${
              isDark ? 'text-white/20' : 'text-[#6F6759]/40'
            }`}
            aria-hidden="true"
          >
            ┐
          </span>
          <span
            className={`absolute bottom-2 left-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${
              isDark ? 'text-white/20' : 'text-[#6F6759]/40'
            }`}
            aria-hidden="true"
          >
            └
          </span>
          <span
            className={`absolute bottom-2 right-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${
              isDark ? 'text-white/20' : 'text-[#6F6759]/40'
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
  <div className={`flex flex-col space-y-1 pb-4 border-b border-[#DCD5C5] ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`font-sans text-[17px] sm:text-[19px] font-medium tracking-tight text-current ${className}`}
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
  <p className={`text-[13px] font-normal text-[#6F6759] leading-relaxed ${className}`} {...props}>
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
  <div className={`flex items-center justify-between pt-4 mt-4 border-t border-[#DCD5C5] ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
