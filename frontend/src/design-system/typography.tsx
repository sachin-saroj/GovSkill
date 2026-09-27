import React from 'react';

export interface DisplaySerifProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  size?: 'xl' | 'lg' | 'md' | 'h2' | 'h3';
  text: string;
  /** Single word receiving editorial emphasis */
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
    xl: 'text-[clamp(64px,10vw,120px)] leading-[0.92] tracking-[-0.035em]',
    lg: 'text-[clamp(44px,6.5vw,84px)] leading-[0.95] tracking-[-0.03em]',
    md: 'text-[clamp(32px,4.5vw,56px)] leading-[1.02] tracking-[-0.025em]',
    h2: 'text-[clamp(28px,3.5vw,48px)] leading-[1.08] tracking-[-0.02em]',
    h3: 'text-[clamp(22px,2.5vw,34px)] leading-[1.15] tracking-[-0.015em]',
  }[size];

  const colorClass = dark ? 'text-white' : 'text-black';

  // Parse words and apply clean emphasis to the designated word
  const words = text.split(/\s+/);
  const normalizedTarget = italicWord.toLowerCase().replace(/[^a-z0-9]/gi, '');

  let foundMatch = false;

  return (
    <Component
      className={`font-sans font-black uppercase ${sizeClasses} ${colorClass} ${className}`}
    >
      {words.map((word, index) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/gi, '');
        const isTarget = !foundMatch && cleanWord === normalizedTarget;

        if (isTarget) {
          foundMatch = true;
          return (
            <React.Fragment key={index}>
              <span className="inline-block text-[#0E50B0] font-black transition-colors">
                {word}
              </span>{' '}
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
  const textColor = dark ? 'text-zinc-400' : 'text-zinc-500';
  const ruleColor = dark ? 'bg-zinc-600' : 'bg-black';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {withRule && (
        <span
          className={`w-3.5 h-[1.5px] shrink-0 ${ruleColor}`}
          aria-hidden="true"
        />
      )}
      <span
        className={`text-[11px] font-sans font-bold uppercase tracking-[0.25em] ${textColor} select-none`}
      >
        {children}
      </span>
    </div>
  );
};

export interface DisplayNumeralProps {
  number: string | number;
  label?: string;
  className?: string;
  size?: 'xl' | 'lg' | 'md';
}

export const DisplayNumeral: React.FC<DisplayNumeralProps> = ({
  number,
  label,
  className = '',
  size = 'xl',
}) => {
  const sizeClasses = {
    xl: 'text-[clamp(56px,8vw,100px)]',
    lg: 'text-[clamp(40px,6vw,72px)]',
    md: 'text-[clamp(28px,4vw,48px)]',
  }[size];

  const formatted = typeof number === 'number' && number < 10 ? `0${number}` : `${number}`;

  return (
    <div className={`inline-flex flex-col leading-none ${className}`}>
      {label && (
        <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-1">
          {label}
        </span>
      )}
      <span className={`font-sans font-black tracking-tighter text-black ${sizeClasses}`}>
        {formatted}
      </span>
    </div>
  );
};

export interface BrokenLetterProps {
  word: string;
  className?: string;
  color?: 'rust' | 'orange' | 'blue' | 'black';
}

export const BrokenLetter: React.FC<BrokenLetterProps> = ({
  word,
  className = '',
  color = 'orange',
}) => {
  const colorMap = {
    rust: 'text-[#AF411E]',
    orange: 'text-[#EE8148]',
    blue: 'text-[#0E50B0]',
    black: 'text-black',
  };

  return (
    <span
      className={`font-sans font-black uppercase select-none tracking-[0.5em] inline-block ${colorMap[color]} ${className}`}
      aria-label={word}
    >
      {word.split('').join(' ')}
    </span>
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
    base: 'text-[15px] leading-[1.6]',
    sm: 'text-[14px] leading-[1.55]',
    xs: 'text-[12px] leading-[1.5]',
  }[size];

  const colorClass = dark
    ? muted
      ? 'text-zinc-400'
      : 'text-white'
    : muted
    ? 'text-[#71717A]'
    : 'text-black';

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
    terracotta: 'text-[#AF411E]',
    ochre: 'text-[#EE8148]',
    muted: 'text-[#71717A]',
  }[variant];

  return (
    <p
      className={`font-sans font-medium text-[clamp(15px,1.2vw,18px)] leading-relaxed border-l-2 border-current pl-4 ${colorClass} ${className}`}
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
