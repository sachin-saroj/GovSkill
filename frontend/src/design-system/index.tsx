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

  const ringClass = dark ? 'ring-[#1A1A1A]' : 'ring-[#F5EFE0]';
  const itemBgClass = dark ? 'bg-[#2A2620] text-[#F5EFE0] border border-[#E8964A]/30' : 'bg-[#EDE4D0] text-[#0A0A0A]';
  const overflowBgClass = dark ? 'bg-[#202020] text-[#E8964A] border border-white/10' : 'bg-[#222222] text-[#EDE4D0]';

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visible.map((av, idx) => (
        <div
          key={idx}
          title={`${av.name} — ${av.role || ''}`}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ${ringClass} ${itemBgClass} text-[11px] font-sans font-semibold uppercase shrink-0 shadow-sm`}
        >
          {av.initials}
        </div>
      ))}
      {remaining > 0 && (
        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ${ringClass} ${overflowBgClass} text-[10px] font-sans font-medium shrink-0 shadow-sm`}>
          +{remaining}
        </div>
      )}
    </div>
  );
};
