import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface Section3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // Maximum translateZ in pixels (e.g. 20-50)
  perspective?: number; // Perspective distance in pixels (e.g. 1000-1500)
}

/**
 * Section3D — Scroll-linked section depth wrapper.
 * Reads scroll position ONLY (via Framer Motion useScroll and useTransform).
 * Strictly contains NO pointer or cursor logic to prevent transform conflicts.
 * Non-reduced-motion environments get a subtle depth parallax as the section enters viewport.
 */
export const Section3D: React.FC<Section3DProps> = ({
  children,
  className = '',
  depth = 30,
  perspective = 1200,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll progression relative to viewport entry/exit
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth scroll-driven depth transformation
  const zDepth = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [-depth, 0, 0, -depth * 0.5]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.75, 1, 1, 0.85]
  );

  if (shouldReduceMotion) {
    return (
      <section ref={sectionRef} className={className}>
        {children}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        style={{
          z: zDepth,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Section3D;
