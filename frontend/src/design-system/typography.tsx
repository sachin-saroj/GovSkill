import React from 'react';

export interface DisplaySerifProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  size?: 'xl' | 'lg' | 'md' | 'h2' | 'h3';
  text: string;
  /** Exactly one word to receive editorial italic emphasis */
  italicWord: string;
  className?: string;
  dark?: boolean;
}

export const DisplaySerif: React.FC<DisplaySerifProps> = ({
  as: Component = 'h1',
  size = 'lg',
  text,
  italicWord,
  className = '',
  dark = false,
}) => {
  const sizeClasses = {
    xl: 'text-[clamp(72px,11vw,140px)] leading-[0.96] tracking-[-0.03em]',
    lg: 'text-[clamp(54px,7.5vw,104px)] leading-[1.0] tracking-[-0.025em]',
    md: 'text-[clamp(38px,5vw,68px)] leading-[1.06] tracking-[-0.02em]',
    h2: 'text-[clamp(32px,4vw,56px)] leading-[1.12] tracking-[-0.02em]',
    h3: 'text-[clamp(24px,3vw,38px)] leading-[1.2] tracking-[-0.015em]',
  }[size];

  const colorClass = dark ? 'text-[#F5EFE0]' : 'text-[#0A0A0A]';

  // Parse words and apply italic styling to the designated single word
  const words = text.split(/\s+/);
  const normalizedTarget = italicWord.toLowerCase().replace(/[^a-z0-9]/gi, '');

  let foundMatch = false;

  return (
    <Component
      className={`font-serif font-normal ${sizeClasses} ${colorClass} ${className}`}
      style={{ fontFamily: '"Fraunces", Georgia, serif' }}
    >
      {words.map((word, index) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/gi, '');
        const isTarget = !foundMatch && cleanWord === normalizedTarget;

        if (isTarget) {
          foundMatch = true;
          return (
            <React.Fragment key={index}>
              <em className="italic font-normal transition-all duration-300">
                {word}
              </em>{' '}
            </React.Fragment>
          );
        }

        return <React.Fragment key={index}>{word} </React.Fragment>;
      })}
    </Component>
  );
};

export interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  withRule?: boolean;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  className = '',
  dark = false,
  withRule = true,
}) => {
  const textColor = dark ? 'text-[#EDE4D0]/70' : 'text-[#6B6357]';
  const ruleColor = dark ? 'bg-[#EDE4D0]/40' : 'bg-[#0A0A0A]/40';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {withRule && (
        <span
          className={`w-4 h-[1px] shrink-0 ${ruleColor}`}
          aria-hidden="true"
        />
      )}
      <span
        className={`text-[11px] font-sans font-medium uppercase tracking-[0.2em] ${textColor} select-none`}
      >
        {children}
      </span>
    </div>
  );
};

export interface BodyTextProps {
  as?: 'p' | 'span' | 'div';
  size?: 'lg' | 'base' | 'sm' | 'xs';
  muted?: boolean;
  dark?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const BodyText: React.FC<BodyTextProps> = ({
  as: Component = 'p',
  size = 'base',
  muted = false,
  dark = false,
  className = '',
  children,
}) => {
  const sizeClass = {
    lg: 'text-[clamp(16px,1.2vw,19px)] leading-[1.65]',
    base: 'text-[16px] leading-[1.62]',
    sm: 'text-[14px] leading-[1.55]',
    xs: 'text-[12px] leading-[1.5]',
  }[size];

  const colorClass = dark
    ? muted
      ? 'text-[#F5EFE0]/70'
      : 'text-[#F5EFE0]'
    : muted
    ? 'text-[#6B6357]'
    : 'text-[#0A0A0A]';

  return (
    <Component
      className={`font-sans font-normal ${sizeClass} ${colorClass} ${className}`}
    >
      {children}
    </Component>
  );
};

export interface PullQuoteProps {
  children: React.ReactNode;
  variant?: 'terracotta' | 'ochre' | 'muted';
  className?: string;
}

export const PullQuote: React.FC<PullQuoteProps> = ({
  children,
  variant = 'terracotta',
  className = '',
}) => {
  const colorClass = {
    terracotta: 'text-[#C97B5A]',
    ochre: 'text-[#C9A24A]',
    muted: 'text-[#6B6357]',
  }[variant];

  return (
    <p
      className={`font-serif italic text-[clamp(15px,1.2vw,18px)] leading-relaxed ${colorClass} ${className}`}
      style={{ fontFamily: '"Fraunces", Georgia, serif' }}
    >
      {children}
    </p>
  );
};

export interface CaptionProps {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

export const Caption: React.FC<CaptionProps> = ({
  children,
  dark = false,
  className = '',
}) => {
  return (
    <span
      className={`text-[11px] font-sans font-medium uppercase tracking-[0.2em] select-none ${
        dark ? 'text-[#EDE4D0]/60' : 'text-[#6B6357]'
      } ${className}`}
    >
      {children}
    </span>
  );
};

export interface FigureCaptionProps {
  figNumber?: string;
  figureNumber?: string;
  title: string;
  dark?: boolean;
  className?: string;
}

export const FigureCaption: React.FC<FigureCaptionProps> = ({
  figNumber,
  figureNumber,
  title,
  dark = false,
  className = '',
}) => {
  const displayNum = figNumber || figureNumber || '01';
  const prefix = displayNum.toUpperCase().startsWith('FIG') ? displayNum : `FIG. ${displayNum}`;

  return (
    <div
      className={`flex items-center justify-between text-[11px] font-mono select-none tracking-[0.18em] uppercase ${
        dark ? 'text-[#EDE4D0]/70' : 'text-[#6B6357]'
      } ${className}`}
    >
      <div className="flex items-center gap-2 truncate">
        <span className={`font-semibold ${dark ? 'text-white' : 'text-[#0A0A0A]'}`}>{prefix}</span>
        <span className="text-[#C97B5A]" aria-hidden="true">•</span>
        <span className="truncate">{title}</span>
      </div>
      <span className="text-[10px] opacity-60 font-mono tracking-widest hidden sm:inline shrink-0 ml-2">
        ARCHIVE REF
      </span>
    </div>
  );
};
