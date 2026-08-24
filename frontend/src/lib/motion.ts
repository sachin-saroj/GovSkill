import { Variants, Transition } from 'framer-motion';

/**
 * Standardized spring physics configurations for tactile civic UI elements.
 */
export const springTactile: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
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
