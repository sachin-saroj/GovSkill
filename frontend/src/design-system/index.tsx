import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export * from './tokens';
export * from './typography';

/* ==========================================================================
   1. BUTTON PRIMITIVE
   Variants:
   - primary: ink pill (#0A0A0A bg, #F5EFE0 text, hover subtle scale)
   - secondary: editorial text link with inline arrow
   - ghost: clean text link / bordered outline pill
   ========================================================================== */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  isLoading?: boolean;
  arrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  dark = false,
  isLoading = false,
  arrow = true,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-sans font-medium transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = dark
      ? 'bg-[#F5EFE0] text-[#0A0A0A] hover:bg-[#EDE4D0] rounded-full px-7 py-3.5 shadow-sm active:scale-[0.98]'
      : 'bg-[#0A0A0A] text-[#F5EFE0] hover:bg-[#222222] hover:shadow-md rounded-full px-7 py-3.5 shadow-sm active:scale-[0.98]';
  } else if (variant === 'secondary') {
    variantClasses = dark
      ? 'bg-transparent text-[#F5EFE0] hover:text-[#EDE4D0] p-0 underline-offset-4 hover:underline'
      : 'bg-transparent text-[#0A0A0A] hover:text-[#6B6357] p-0 underline-offset-4 hover:underline';
  } else if (variant === 'ghost') {
    variantClasses = dark
      ? 'bg-transparent border border-[#EDE4D0]/30 text-[#F5EFE0] hover:bg-[#F5EFE0]/10 rounded-full px-5 py-2.5'
      : 'bg-transparent border border-[#D9CFBB] text-[#0A0A0A] hover:bg-[#EDE4D0]/40 rounded-full px-5 py-2.5';
  }

  const sizeClass = {
    sm: 'text-[13px]',
    md: 'text-[14px]',
    lg: 'text-[16px]',
  }[size];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Processing…</span>
        </span>
      ) : (
        <>
          <span>{children}</span>
          {arrow && variant === 'secondary' && (
            <svg
              className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          )}
        </>
      )}
    </button>
  );
};

/* ==========================================================================
   2. CARD PRIMITIVE
   Variants:
   - floating: soft cream frame, generous margin, floating shadow
   - stage: dark rounded container (#111111)
   - testimonial: editorial quote card with avatar stack
   ========================================================================== */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'floating' | 'stage' | 'testimonial';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'floating',
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    floating:
      'bg-[#EDE4D0]/40 border border-[#D9CFBB]/70 rounded-[28px] p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(10,10,10,0.06)] backdrop-blur-sm',
    stage:
      'bg-[#111111] text-[#F5EFE0] rounded-[36px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] border border-white/5',
    testimonial:
      'bg-[#191919] text-[#F5EFE0] border border-white/10 rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shrink-0 min-w-[320px] max-w-[420px] shadow-lg',
  }[variant];

  return (
    <div className={`${variantClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/* ==========================================================================
   3. MARQUEE PRIMITIVE
   Continuous horizontal drift, pauses on hover / focus-within, aria-hidden duplicates
   ========================================================================== */

export interface MarqueeProps {
  items: string[];
  duration?: number;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  duration = 40,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`group relative overflow-hidden select-none py-6 border-y border-[#D9CFBB]/60 ${className}`}
      tabIndex={0}
      aria-label="Partner institutions and agencies marquee"
    >
      <div
        className={`flex items-center gap-14 sm:gap-20 whitespace-nowrap w-max ${
          shouldReduceMotion ? '' : 'animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]'
        }`}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {/* Primary Set */}
        {items.map((item, idx) => (
          <span
            key={`orig-${idx}`}
            className="text-[13px] font-sans font-medium uppercase tracking-[0.2em] text-[#6B6357] opacity-80 transition-opacity hover:opacity-100"
          >
            {item}
          </span>
        ))}

        {/* Aria-Hidden Duplicate Set for Continuous Loop */}
        {items.map((item, idx) => (
          <span
            key={`dup-${idx}`}
            aria-hidden="true"
            className="text-[13px] font-sans font-medium uppercase tracking-[0.2em] text-[#6B6357] opacity-80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   4. CHIP PRIMITIVE (Tag Cloud)
   Irregular sizing allowed, typographic texture, non-boxy pill
   ========================================================================== */

export interface ChipProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  size = 'md',
  dark = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[12px] px-3.5 py-1.5',
    md: 'text-[14px] px-5 py-2.5',
    lg: 'text-[16px] px-6 py-3',
  }[size];

  const colorClasses = dark
    ? 'bg-white/5 border-white/15 text-[#F5EFE0] hover:bg-white/10'
    : 'bg-[#EDE4D0]/60 border-[#D9CFBB] text-[#0A0A0A] hover:bg-[#EDE4D0]';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-sans font-normal tracking-tight transition-colors duration-200 select-none ${sizeClasses} ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};

/* ==========================================================================
   5. METRIC BLOCK
   Large serif number with count-up animation + small sans label
   ========================================================================== */

export interface MetricBlockProps {
  targetNumber: number;
  suffix?: string;
  prefix?: string;
  label: string;
  context?: string;
  dark?: boolean;
  className?: string;
}

export const MetricBlock: React.FC<MetricBlockProps> = ({
  targetNumber,
  suffix = '',
  prefix = '',
  label,
  context,
  dark = true,
  className = '',
}) => {
  const [current, setCurrent] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrent(targetNumber);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1200;
          const startTime = performance.now();

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(eased * targetNumber);
            setCurrent(val);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCurrent(targetNumber);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [targetNumber, hasAnimated, shouldReduceMotion]);

  return (
    <div ref={ref} className={`space-y-2 ${className}`}>
      <div
        className={`font-serif text-[clamp(44px,6vw,84px)] font-normal leading-none tracking-[-0.03em] ${
          dark ? 'text-[#F5EFE0]' : 'text-[#0A0A0A]'
        }`}
        style={{ fontFamily: '"Fraunces", Georgia, serif' }}
      >
        {prefix}
        {current.toLocaleString()}
        {suffix}
      </div>
      <div
        className={`text-[12px] uppercase tracking-[0.14em] font-sans font-medium ${
          dark ? 'text-[#EDE4D0]/70' : 'text-[#6B6357]'
        }`}
      >
        {label}
      </div>
      {context && (
        <p
          className={`text-[13px] font-sans font-normal leading-relaxed max-w-[260px] ${
            dark ? 'text-[#EDE4D0]/50' : 'text-[#6B6357]/80'
          }`}
        >
          {context}
        </p>
      )}
    </div>
  );
};

/* ==========================================================================
   6. ILLUSTRATION FRAME
   Re-export authoritative component from @/components/IllustrationFrame
   ========================================================================== */
export * from '@/components/IllustrationFrame';

/* ==========================================================================
   7. SCROLL SECTION WRAPPER
   Scroll-driven entry with prefers-reduced-motion safety
   ========================================================================== */

export interface ScrollSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  id,
  className = '',
  dark = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full ${dark ? 'bg-[#111111] text-[#F5EFE0]' : 'bg-[#F5EFE0] text-[#0A0A0A]'} ${className}`}
    >
      {children}
    </motion.section>
  );
};

/* ==========================================================================
   8. AVATAR STACK PRIMITIVE
   Overlapping circular avatars (max 4) + optional +N overflow counter
   ========================================================================== */

export interface AvatarStackProps {
  avatars: Array<{ name: string; initials: string; role?: string }>;
  overflowCount?: number;
  className?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  avatars,
  overflowCount = 0,
  className = '',
}) => {
  const visible = avatars.slice(0, 3);
  const remaining = overflowCount > 0 ? overflowCount : Math.max(0, avatars.length - 3);

  return (
    <div className={`flex items-center -space-x-2.5 overflow-hidden ${className}`}>
      {visible.map((av, idx) => (
        <div
          key={idx}
          title={`${av.name} — ${av.role || ''}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-[#F5EFE0] bg-[#EDE4D0] text-[#0A0A0A] text-[11px] font-sans font-semibold uppercase shrink-0"
        >
          {av.initials}
        </div>
      ))}
      {remaining > 0 && (
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-[#F5EFE0] bg-[#222222] text-[#EDE4D0] text-[10px] font-sans font-medium shrink-0">
          +{remaining}
        </div>
      )}
    </div>
  );
};
