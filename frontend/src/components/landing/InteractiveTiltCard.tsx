import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  showSheen?: boolean;
  onClick?: () => void;
}

export const InteractiveTiltCard: React.FC<InteractiveTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 5,
  perspective = 1000,
  showSheen = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Raw normalized mouse coordinates [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, non-jittery spring physics
  const springConfig = { damping: 24, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Derive tilt angles (rotateX maps to Y-movement, rotateY maps to X-movement)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Derive specular sheen percentages (0% to 100%)
  const sheenX = useTransform(smoothX, [-0.5, 0.5], [10, 90]);
  const sheenY = useTransform(smoothY, [-0.5, 0.5], [10, 90]);
  const sheenBackground = useMotionTemplate`radial-gradient(circle 260px at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.2), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  if (shouldReduceMotion) {
    return (
      <div
        ref={cardRef}
        className={`relative rounded-3xl ${className}`}
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
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className={`relative overflow-hidden rounded-3xl ${
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
