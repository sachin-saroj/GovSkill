import React from 'react';

/**
 * Editorial Section Number (e.g. "01", "02", "§ 3.1")
 * Adds subtle technical and statutory grounding to section headers.
 */
export interface SectionNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  dark?: boolean;
}

export const SectionNumber: React.FC<SectionNumberProps> = ({
  children,
  dark = false,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center font-mono text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded border select-none ${
        dark
          ? 'bg-white/5 border-white/10 text-[#E8964A]'
          : 'bg-[#EDE4D0]/60 border-[#D9CFBB] text-[#6B6357]'
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Subtle Editorial Rule / Divider with optional centered label or accent
 */
export interface EditorialRuleProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  dark?: boolean;
}

export const EditorialRule: React.FC<EditorialRuleProps> = ({
  label,
  dark = false,
  className = '',
  ...props
}) => {
  const ruleColor = dark ? 'bg-white/10' : 'bg-[#D9CFBB]';
  const textColor = dark ? 'text-[#EDE4D0]/50 bg-[#111111]' : 'text-[#6B6357] bg-[#F5EFE0]';

  if (!label) {
    return <div className={`w-full h-[1px] ${ruleColor} ${className}`} {...props} />;
  }

  return (
    <div className={`relative flex items-center justify-center w-full my-4 ${className}`} {...props}>
      <div className={`absolute inset-0 flex items-center`} aria-hidden="true">
        <div className={`w-full h-[1px] ${ruleColor}`} />
      </div>
      <span className={`relative px-3 font-mono text-[11px] uppercase tracking-[0.18em] ${textColor} select-none`}>
        {label}
      </span>
    </div>
  );
};

/**
 * Status Dot Indicator
 */
export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status = 'info',
  pulse = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const colorMap = {
    success: 'bg-[#2A5B4A]',
    warning: 'bg-[#C9A24A]',
    danger: 'bg-[#C97B5A]',
    info: 'bg-[#0A0A0A]',
    neutral: 'bg-[#6B6357]',
  };

  const sizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-block rounded-full shrink-0 ${sizeMap[size]} ${colorMap[status]} ${
        pulse ? 'animate-pulse' : ''
      } ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Editorial Technical Corner Brackets (for wrapping any container)
 */
export interface CornerBracketsProps {
  dark?: boolean;
}

export const CornerBrackets: React.FC<CornerBracketsProps> = ({ dark = false }) => {
  const colorClass = dark ? 'text-white/20' : 'text-[#6B6357]/40';
  return (
    <>
      <span
        className={`absolute top-2 left-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${colorClass}`}
        aria-hidden="true"
      >
        ┌
      </span>
      <span
        className={`absolute top-2 right-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${colorClass}`}
        aria-hidden="true"
      >
        ┐
      </span>
      <span
        className={`absolute bottom-2 left-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${colorClass}`}
        aria-hidden="true"
      >
        └
      </span>
      <span
        className={`absolute bottom-2 right-2.5 font-mono text-[10px] leading-none pointer-events-none select-none ${colorClass}`}
        aria-hidden="true"
      >
        ┘
      </span>
    </>
  );
};
