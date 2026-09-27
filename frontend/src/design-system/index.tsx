import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export * from './tokens';
export * from './typography';
export * from '@/components/ui';

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
      className={`group relative overflow-hidden select-none py-6 border-y border-[#E4E4E7] bg-white ${className}`}
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
            className="text-[12px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-black"
          >
            {item}
          </span>
        ))}

        {/* Aria-Hidden Duplicate Set for Continuous Loop */}
        {items.map((item, idx) => (
          <span
            key={`dup-${idx}`}
            aria-hidden="true"
            className="text-[12px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-400"
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
    sm: 'text-[11px] px-3 py-1 font-semibold',
    md: 'text-[13px] px-4 py-2 font-medium',
    lg: 'text-[15px] px-5 py-2.5 font-medium',
  }[size];

  const colorClasses = dark
    ? 'bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500'
    : 'bg-white border-[#E4E4E7] text-black hover:border-black hover:bg-zinc-50';

  return (
    <span
      className={`inline-flex items-center rounded-none border font-sans tracking-tight transition-all duration-150 select-none shadow-[1px_1px_0px_rgba(0,0,0,0.08)] ${sizeClasses} ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};

/* ==========================================================================
   5. METRIC BLOCK
   Large sans number with count-up animation + small tracked label
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
  dark = false,
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
    <div ref={ref} className={`space-y-1.5 ${className}`}>
      <div
        className={`font-sans text-[clamp(44px,6vw,84px)] font-black leading-none tracking-tighter ${
          dark ? 'text-white' : 'text-black'
        }`}
      >
        {prefix}
        {current.toLocaleString()}
        {suffix}
      </div>
      <div
        className={`text-[11px] uppercase tracking-[0.2em] font-sans font-bold ${
          dark ? 'text-zinc-400' : 'text-zinc-600'
        }`}
      >
        {label}
      </div>
      {context && (
        <p
          className={`text-[13px] font-sans font-normal leading-relaxed max-w-[260px] ${
            dark ? 'text-zinc-400' : 'text-zinc-500'
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
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full ${dark ? 'bg-black text-white' : 'bg-white text-black'} ${className}`}
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
  dark?: boolean;
  className?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  avatars,
  overflowCount = 0,
  dark = false,
  className = '',
}) => {
  const visible = avatars.slice(0, 3);
  const remaining = overflowCount > 0 ? overflowCount : Math.max(0, avatars.length - 3);

  const ringClass = dark ? 'ring-black' : 'ring-white';
  const itemBgClass = dark ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-zinc-100 text-black border border-zinc-300';
  const overflowBgClass = dark ? 'bg-zinc-800 text-zinc-300 border border-zinc-600' : 'bg-black text-white';

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visible.map((av, idx) => (
        <div
          key={idx}
          title={`${av.name} — ${av.role || ''}`}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ${ringClass} ${itemBgClass} text-[11px] font-sans font-bold uppercase shrink-0 shadow-xs`}
        >
          {av.initials}
        </div>
      ))}
      {remaining > 0 && (
        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ${ringClass} ${overflowBgClass} text-[10px] font-sans font-bold shrink-0 shadow-xs`}>
          +{remaining}
        </div>
      )}
    </div>
  );
};
