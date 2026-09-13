import React from 'react';

export interface GovSkillLogoProps {
  /** Size variant or numerical dimension in pixels */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Presentation variant: 'icon' (emblem only) or 'full' (emblem + typography wordmark) */
  variant?: 'icon' | 'full' | 'stacked';
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
  xs: 20,
  sm: 26,
  md: 34,
  lg: 44,
  xl: 56,
};

/**
 * GovSkill Official Sovereign Logo & Emblem Component
 *
 * Integrates:
 * 1. Neoclassical Civic Pediment & Fluted Pillars (Public Administration & Integrity)
 * 2. Open Statutory Codex / Book (Digital Skill & Competency Advancement)
 * 3. Eight-Pointed Sovereign Star of Public Service (Excellence & Enlightenment)
 * 4. Archival Passe-Partout Cartouche Frame (Museum-grade Editorial Standard)
 */
export const GovSkillLogo: React.FC<GovSkillLogoProps> = ({
  size = 'md',
  variant = 'icon',
  theme = 'dark',
  className = '',
  ariaLabel = 'GovSkill Sovereign Civic Logo',
  showBadge = true,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 34;

  // Background & Stroke logic based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          bg: '#EDE4D0',
          border: '#D9CFBB',
          innerDash: '#6B6357',
          pediment: '#0A0A0A',
          pillars: '#0A0A0A',
          bookLeft: '#F5EFE0',
          bookRight: '#FFFFFF',
          spine: '#C97B5A',
          star: '#C9A24A',
          starGlow: '#E8964A',
        };
      case 'gold':
        return {
          bg: '#C9A24A',
          border: '#0A0A0A',
          innerDash: '#0A0A0A',
          pediment: '#0A0A0A',
          pillars: '#0A0A0A',
          bookLeft: '#F5EFE0',
          bookRight: '#FFFFFF',
          spine: '#C97B5A',
          star: '#FFFFFF',
          starGlow: '#F5EFE0',
        };
      case 'monochrome':
        return {
          bg: '#0A0A0A',
          border: '#FFFFFF',
          innerDash: '#FFFFFF',
          pediment: '#FFFFFF',
          pillars: '#FFFFFF',
          bookLeft: '#CCCCCC',
          bookRight: '#FFFFFF',
          spine: '#FFFFFF',
          star: '#FFFFFF',
          starGlow: '#FFFFFF',
        };
      case 'dark':
      default:
        return {
          bg: '#0A0A0A',
          border: '#C9A24A',
          innerDash: '#D9CFBB',
          pediment: '#C9A24A',
          pillars: '#F5EFE0',
          bookLeft: '#EDE4D0',
          bookRight: '#F5EFE0',
          spine: '#C97B5A',
          star: '#E8964A',
          starGlow: '#C9A24A',
        };
    }
  };

  const colors = getColors();

  const emblemSvg = (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label={ariaLabel}
    >
      {/* 1. Sovereign Cartouche Medallion Frame */}
      <rect
        x="2.5"
        y="2.5"
        width="59"
        height="59"
        rx="14"
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth="1.5"
      />

      {/* 2. Inner Archival Guilloche Hairline */}
      <rect
        x="5.5"
        y="5.5"
        width="53"
        height="53"
        rx="11"
        fill="none"
        stroke={colors.innerDash}
        strokeWidth="0.75"
        strokeDasharray="2.5 1.5"
        opacity="0.65"
      />

      {/* 3. Neoclassical Classical Pediment (Governance) */}
      <path
        d="M18 23.5 L32 14.5 L46 23.5 Z"
        fill={colors.pediment}
        stroke={colors.border}
        strokeWidth="0.8"
      />
      <rect x="16" y="23.5" width="32" height="2" rx="0.5" fill={colors.pillars} />

      {/* 4. Classical Fluted Columns (Public Integrity & Statecraft) */}
      <rect x="20.5" y="25.5" width="3.5" height="13.5" rx="0.75" fill={colors.pillars} />
      <rect x="30.25" y="25.5" width="3.5" height="13.5" rx="0.75" fill={colors.pillars} />
      <rect x="40" y="25.5" width="3.5" height="13.5" rx="0.75" fill={colors.pillars} />

      {/* Column Capitols & Bases */}
      <rect x="19.5" y="25.5" width="5.5" height="1" rx="0.3" fill={colors.border} />
      <rect x="29.25" y="25.5" width="5.5" height="1" rx="0.3" fill={colors.border} />
      <rect x="39" y="25.5" width="5.5" height="1" rx="0.3" fill={colors.border} />

      <rect x="19.5" y="38" width="5.5" height="1" rx="0.3" fill={colors.border} />
      <rect x="29.25" y="38" width="5.5" height="1" rx="0.3" fill={colors.border} />
      <rect x="39" y="38" width="5.5" height="1" rx="0.3" fill={colors.border} />

      {/* Base Plinth */}
      <rect x="16.5" y="39" width="31" height="1.8" rx="0.5" fill={colors.pillars} />

      {/* 5. Open Statutory Codex / Learning Folio (Competency & Skill) */}
      {/* Left Page */}
      <path
        d="M32 40 C27 37 20.5 38 15 40.5 L15 48.5 C20.5 46.5 27 45.5 32 48.5 Z"
        fill={colors.bookLeft}
        stroke="#0A0A0A"
        strokeWidth="0.8"
      />
      {/* Right Page */}
      <path
        d="M32 40 C37 37 43.5 38 49 40.5 L49 48.5 C43.5 46.5 37 45.5 32 48.5 Z"
        fill={colors.bookRight}
        stroke="#0A0A0A"
        strokeWidth="0.8"
      />
      {/* Center Spine */}
      <line
        x1="32"
        y1="39.8"
        x2="32"
        y2="49"
        stroke={colors.spine}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Engraved Page Lines */}
      <line x1="18.5" y1="42.8" x2="27.5" y2="41.5" stroke="#6B6357" strokeWidth="0.65" />
      <line x1="18.5" y1="45.5" x2="26.5" y2="44.3" stroke="#6B6357" strokeWidth="0.65" />
      <line x1="36.5" y1="41.5" x2="45.5" y2="42.8" stroke="#6B6357" strokeWidth="0.65" />
      <line x1="37.5" y1="44.3" x2="45.5" y2="45.5" stroke="#6B6357" strokeWidth="0.65" />

      {/* 6. Eight-Pointed Sovereign Star of Public Service (Wisdom & Guidance) */}
      <path
        d="M32 7.5 L33.4 11.2 L37.2 12.5 L33.4 13.8 L32 17.5 L30.6 13.8 L26.8 12.5 L30.6 11.2 Z"
        fill={colors.star}
        stroke={colors.starGlow}
        strokeWidth="0.5"
      />
      <circle cx="32" cy="12.5" r="1.1" fill="#FFFFFF" />

      {/* Corner Registration Ticks */}
      <circle cx="9" cy="9" r="0.75" fill={colors.border} opacity="0.8" />
      <circle cx="55" cy="9" r="0.75" fill={colors.border} opacity="0.8" />
      <circle cx="9" cy="55" r="0.75" fill={colors.border} opacity="0.8" />
      <circle cx="55" cy="55" r="0.75" fill={colors.border} opacity="0.8" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {emblemSvg}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 group ${className}`}>
        {emblemSvg}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span
              className="font-serif text-[22px] font-normal tracking-[-0.03em] text-[#0A0A0A] leading-none"
              style={{ fontFamily: '"Fraunces", Georgia, serif' }}
            >
              GovSkill
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8964A]" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-sans text-[#6B6357] font-normal tracking-tight mt-1">
            Digital Competency Standard
          </span>
        </div>
      </div>
    );
  }

  // variant === 'full' (Horizontal layout with wordmark & badge)
  return (
    <div className={`inline-flex items-center gap-3 group ${className}`}>
      {emblemSvg}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className="font-serif text-[21px] sm:text-[23px] font-normal tracking-[-0.03em] text-[#0A0A0A] leading-tight"
            style={{ fontFamily: '"Fraunces", Georgia, serif' }}
          >
            GovSkill
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8964A]" aria-hidden="true" />
          {showBadge && (
            <span className="text-[9.5px] font-mono uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB] ml-1 shadow-2xs">
              DPI
            </span>
          )}
        </div>
        <span className="text-[11px] font-sans text-[#6B6357] font-normal tracking-tight">
          Digital Skill Support for Local Governance
        </span>
      </div>
    </div>
  );
};

export default GovSkillLogo;
