import React from 'react';

export type IllustrationKey = 'hero' | 'statement' | 'featureA' | 'featureB' | 'finalCta';

export interface AnimatedIllustrationProps {
  illustrationKey: IllustrationKey;
  className?: string;
}

export const AnimatedIllustration: React.FC<AnimatedIllustrationProps> = ({
  illustrationKey,
  className = '',
}) => {
  switch (illustrationKey) {
    case 'hero':
      return (
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
          aria-hidden="true"
        >
          <defs>
            {/* Soft Warm Radial Lamp Glow on the banker's brass lamp */}
            <radialGradient
              id="lampGlow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(100 240) rotate(90) scale(120 140)"
            >
              <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#C97B5A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
            </radialGradient>

            {/* Arched Morning Window Ambient Light Shift */}
            <linearGradient id="windowLight" x1="120" y1="40" x2="220" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5EFE0" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#C9A24A" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F5EFE0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Arched Window Ambient Morning Light Shift */}
          <path
            d="M 80 80 Q 140 30 200 80 L 200 270 L 80 270 Z"
            fill="url(#windowLight)"
            className="animate-window-shift"
          />

          {/* Desk Lamp Warm Radial Pulse */}
          <circle
            cx="100"
            cy="240"
            r="100"
            fill="url(#lampGlow)"
            className="animate-lamp-pulse"
            style={{ transformOrigin: '100px 240px' }}
          />
        </svg>
      );

    case 'statement':
      return (
        <svg
          viewBox="0 0 1200 675"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="statementLight" x1="200" y1="0" x2="600" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#F5EFE0" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F5EFE0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Soft Morning Colonnade Sunlight Shift */}
          <rect
            x="0"
            y="0"
            width="1200"
            height="500"
            fill="url(#statementLight)"
            className="animate-sky-breathe"
          />
        </svg>
      );

    case 'featureA':
      return (
        <svg
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
          aria-hidden="true"
        >
          <defs>
            {/* Subtle Convex Lens Optical Caustic: simulates ambient light grazing curved glass */}
            <radialGradient
              id="lensCaustic"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(500 220) rotate(45) scale(90 70)"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.30" />
              <stop offset="45%" stopColor="#F5EFE0" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F5EFE0" stopOpacity="0" />
            </radialGradient>

            {/* Archival Paper Ambient Tone */}
            <radialGradient
              id="docWarmth"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(400 300) scale(400 300)"
            >
              <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft Optical Glare Shimmer over the Magnifying Lens */}
          <ellipse
            cx="500"
            cy="220"
            rx="85"
            ry="65"
            transform="rotate(-15 500 220)"
            fill="url(#lensCaustic)"
            className="animate-pulse-subtle"
          />

          {/* Ambient Paper Tone */}
          <rect
            x="0"
            y="0"
            width="800"
            height="600"
            fill="url(#docWarmth)"
          />
        </svg>
      );

    case 'featureB':
      return (
        <svg
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
          aria-hidden="true"
        >
          <defs>
            {/* Sovereign Medallion Holographic Gold Luster */}
            <radialGradient
              id="sealGoldLuster"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(400 300) scale(180 180)"
            >
              <stop offset="0%" stopColor="#E5C158" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.10" />
              <stop offset="85%" stopColor="#C97B5A" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#C9A24A" stopOpacity="0" />
            </radialGradient>

            {/* Archival Paper Vignette */}
            <radialGradient
              id="paperVignette"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(400 300) scale(380 280)"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="75%" stopColor="transparent" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.04" />
            </radialGradient>
          </defs>

          {/* Breathing Medallion Luster */}
          <circle
            cx="400"
            cy="300"
            r="170"
            fill="url(#sealGoldLuster)"
            className="animate-pulse-subtle"
          />

          {/* Paper Edge Depth Vignette */}
          <rect
            x="0"
            y="0"
            width="800"
            height="600"
            fill="url(#paperVignette)"
          />
        </svg>
      );

    case 'finalCta':
      return (
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Sky Gradient Hue Breathe */}
            <linearGradient id="skyBreathe" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#C97B5A" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </linearGradient>

            {/* Path Light Shimmer Sweep */}
            <linearGradient id="pathShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#C9A24A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Sky Gradient Layer */}
          <rect
            x="0"
            y="0"
            width="1440"
            height="360"
            fill="url(#skyBreathe)"
            className="animate-sky-breathe"
          />

          {/* Path Light Shimmer Sweep on Golden Path */}
          <g className="overflow-hidden">
            <rect
              x="-200"
              y="320"
              width="600"
              height="200"
              fill="url(#pathShimmer)"
              className="animate-path-shimmer"
            />
          </g>
        </svg>
      );

    default:
      return null;
  }
};

export default AnimatedIllustration;
