import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { useFinePointer, springDepth, springTactile } from '@/lib/motion';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  showSheen?: boolean;
  onClick?: () => void;
}

/**
 * InteractiveTiltCard — Cursor-driven 3D tilt card component.
 * Cursor effects are strictly gated behind useFinePointer().
 * Touch screens and reduced motion users receive an entirely static fallback.
 * Transform effects remain strictly local to this individual card.
 */
export const InteractiveTiltCard: React.FC<InteractiveTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 4,
  perspective = 1000,
  showSheen = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isFinePointer = useFinePointer();

  // Raw normalized mouse coordinates [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, non-jittery spring physics using standardized preset
  const smoothX = useSpring(mouseX, springDepth);
  const smoothY = useSpring(mouseY, springDepth);

  // Derive tilt angles (rotateX maps to Y-movement, rotateY maps to X-movement)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Derive specular sheen percentages (0% to 100%)
  const sheenX = useTransform(smoothX, [-0.5, 0.5], [10, 90]);
  const sheenY = useTransform(smoothY, [-0.5, 0.5], [10, 90]);
  const sheenBackground = useMotionTemplate`radial-gradient(circle 280px at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.18), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !isFinePointer || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseEnter = () => {
    if (isFinePointer && !shouldReduceMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // On touch / coarse pointer devices or reduced motion, render clean static container
  if (shouldReduceMotion || !isFinePointer) {
    return (
      <div
        ref={cardRef}
        className={`relative ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: `${perspective}px` }}
      className="relative w-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={springTactile}
        className={`relative overflow-hidden ${
          isHovered ? 'shadow-civic-xl' : 'shadow-civic-md'
        } ${className}`}
      >
        {/* Dynamic Specular Sheen (GPU accelerated, no re-render lag) */}
        {showSheen && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.6 : 0,
              background: sheenBackground,
            }}
          />
        )}

        {/* Card Content with 3D child preservation */}
        <div style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveTiltCard;
