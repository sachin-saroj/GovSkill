import { useState, useEffect } from 'react';
import { Variants, Transition } from 'framer-motion';

/**
 * Hook to check if the current device supports fine pointer (mouse/trackpad)
 * and hover states. Gates all cursor-driven 3D tilt, parallax, and magnetic effects.
 * Non-fine-pointer devices (touch screens) receive a clean, static fallback.
 */
export function useFinePointer(): boolean {
  const [isFinePointer, setIsFinePointer] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return true; // Default fallback for SSR / non-browser test environments
    }
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updatePointer = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsFinePointer(e.matches);
    };

    // Initial check
    setIsFinePointer(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePointer);
      return () => mediaQuery.removeEventListener('change', updatePointer);
    } else if (typeof (mediaQuery as any).addListener === 'function') {
      (mediaQuery as any).addListener(updatePointer);
      return () => (mediaQuery as any).removeListener(updatePointer);
    }
  }, []);

  return isFinePointer;
}

/**
 * Standardized spring physics configurations for tactile civic UI elements.
 */
export const springTactile: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const springDepth: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 26,
};

export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 24,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 20,
};

export const springHero: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 22,
  mass: 0.8,
};

/**
 * Scroll reveal variants with depth
 */
export const fadeUpReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springDepth,
  },
};

export const fadeUpRevealReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

/**
 * Container variant that staggers direct children entrance.
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

/**
 * Standard fade up variant for headers, cards, and forms.
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSmooth,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
};

/**
 * Scale in variant for badges, indicators, and modal dialogues.
 */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTactile,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

/**
 * Slide horizontal variant for lists, sidebars, and chat messages.
 */
export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springSmooth,
  },
  exit: {
    opacity: 0,
    x: 12,
    transition: { duration: 0.15 },
  },
};

/**
 * Viewport reveal configuration for scroll triggers.
 */
export const viewportOnce = {
  once: true,
  margin: '-40px',
};
