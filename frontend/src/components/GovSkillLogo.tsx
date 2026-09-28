import React from 'react';

export interface GovSkillLogoProps {
  /** Size variant or numerical dimension in pixels */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Presentation variant: 'icon' (emblem only), 'horizontal' (emblem + wordmark lockup), 'stacked', or 'full' */
  variant?: 'icon' | 'horizontal' | 'full' | 'stacked';
  /** Optional theme override */
  theme?: 'dark' | 'light' | 'gold' | 'monochrome';
  /** Additional container classes */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Whether to show the DPI certification micro-badge in 'full' variant */
  showBadge?: boolean;
}

const SIZE_MAP = {
  xs: 26,
  sm: 36,
  md: 48,
  lg: 64,
  xl: 84,
};

/**
 * GovSkill Official Sovereign Logo & Emblem Component
 *
 * Uses the authentic neoclassical civic temple transparent PNG emblem:
 * 1. Neoclassical Civic Pediment & Fluted Pillars with glowing digital light beams
 * 2. Authentic transparent PNG format
 * 3. Supports icon, horizontal full lockup, and stacked presentations
 */
export const GovSkillLogo: React.FC<GovSkillLogoProps> = ({
  size = 'md',
  variant = 'icon',
  className = '',
  ariaLabel = 'GovSkill Sovereign Civic Logo',
  showBadge = true,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 48;

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/govskill-icon.png"
          alt={ariaLabel}
          width={pixelSize}
          height={pixelSize}
          className="object-contain drop-shadow-xs transition-transform group-hover:scale-105"
          style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src="/govskill-horizontal.png"
          alt={ariaLabel}
          className="object-contain max-w-full drop-shadow-xs transition-transform group-hover:scale-[1.02]"
          style={{ height: `${pixelSize}px`, width: 'auto' }}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 group ${className}`}>
        <img
          src="/govskill-logo.png"
          alt={ariaLabel}
          className="object-contain max-w-full drop-shadow-sm transition-transform group-hover:scale-105"
          style={{ height: `${Math.round(pixelSize * 1.6)}px`, width: 'auto' }}
          loading="eager"
        />
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-sans text-[#6B6357] font-normal tracking-tight mt-1">
            Digital Competency Standard
          </span>
        </div>
      </div>
    );
  }

  // variant === 'full' (Horizontal layout with emblem + wordmark + optional badge)
  return (
    <div className={`inline-flex items-center gap-3 group shrink-0 ${className}`}>
      <img
        src="/govskill-horizontal.png"
        alt={ariaLabel}
        className="object-contain drop-shadow-xs"
        style={{ height: `${pixelSize}px`, width: 'auto' }}
        loading="eager"
      />
      {showBadge && (
        <span className="text-[9.5px] font-mono uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] shadow-2xs">
          DPI
        </span>
      )}
    </div>
  );
};

export default GovSkillLogo;
