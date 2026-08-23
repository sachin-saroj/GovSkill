import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

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
  maxTilt = 8,
  perspective = 1000,
  showSheen = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for natural tactile feel
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Derive tilt rotations (rotateX responds to Y movement, rotateY responds to X movement)
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Derive dynamic specular sheen position
  const sheenX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized relative position from center [-0.5, 0.5]
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return to flat resting position
    mouseX.set(0);
    mouseY.set(0);
  };

  if (shouldReduceMotion) {
    return (
      <div
        ref={cardRef}
        className={`relative rounded-2xl ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      className="relative w-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative overflow-hidden rounded-2xl transition-shadow duration-300 ${
          isHovered ? 'shadow-civic-xl' : 'shadow-civic-md'
        } ${className}`}
      >
        {/* Dynamic Specular Sheen / Light Highlight */}
        {showSheen && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: `radial-gradient(circle 280px at ${sheenX.get()} ${sheenY.get()}, rgba(255,255,255,0.4), transparent 80%)`,
            }}
          />
        )}

        {/* Card Content with 3D child preservation */}
        <div style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveTiltCard;
