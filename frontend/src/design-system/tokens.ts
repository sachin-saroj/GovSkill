/**
 * GovSkill Editorial Design System Tokens
 * Source of truth for color, typography, spacing, elevations, and motion curves.
 */

export const tokens = {
  colors: {
    // "50 Ambitious" Core Canvas & Ink
    canvas: '#FFFFFF',
    ink: '#000000',
    inkMuted: '#71717A',
    rule: '#E4E4E7',
    stage: '#000000',
    stageText: '#FFFFFF',

    // "50 Ambitious" Strict Accent Families
    accentRust: '#AF411E',   // Darker rust/terracotta accent
    accentOrange: '#EE8148', // Vibrant warm orange accent
    accentBlue: '#0E50B0',   // Deep cobalt/royal blue accent

    // Backward-Compatible Editorial Aliases
    cream: '#FFFFFF',
    creamDeep: '#F4F4F5',
    accentGreen: '#0E50B0',
    accentWarm: '#EE8148',
    terracotta: '#AF411E',
    olive: '#52525B',
    ochre: '#EE8148',
    dustyBlue: '#0E50B0',
    paper: '#FFFFFF',

    // Semantic Status Systems
    status: {
      success: {
        solid: '#15803D',
        bg: '#F0FDF4',
        border: '#BBF7D0',
        text: '#166534',
      },
      warning: {
        solid: '#EE8148',
        bg: '#FFF7ED',
        border: '#FED7AA',
        text: '#C2410C',
      },
      danger: {
        solid: '#AF411E',
        bg: '#FEF2F2',
        border: '#FECACA',
        text: '#991B1B',
      },
      info: {
        solid: '#0E50B0',
        bg: '#EFF6FF',
        border: '#BFDBFE',
        text: '#0E50B0',
      },
      neutral: {
        solid: '#71717A',
        bg: '#F4F4F5',
        border: '#E4E4E7',
        text: '#18181B',
      },
    },

    // Semantic Surfaces
    surfaces: {
      canvas: '#FFFFFF',
      subtle: '#FAFAFA',
      paper: '#FFFFFF',
      pure: '#FFFFFF',
      dark: '#000000',
      darkElevated: '#18181B',
    },

    // Semantic Text
    text: {
      primary: '#000000',
      secondary: '#71717A',
      muted: '#A1A1AA',
      onDark: '#FFFFFF',
      onDarkMuted: '#A1A1AA',
    },

    // Semantic Borders
    borders: {
      subtle: '#F4F4F5',
      default: '#E4E4E7',
      strong: '#000000',
      onDark: 'rgba(255, 255, 255, 0.15)',
    },
  },
  typography: {
    fontSerif: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    displayXl: 'clamp(72px, 11vw, 140px)',
    displayLg: 'clamp(56px, 8vw, 112px)',
    displayMd: 'clamp(40px, 5vw, 72px)',
    h2: 'clamp(32px, 4vw, 56px)',
    h3: 'clamp(24px, 3vw, 38px)',
    bodyLg: '18px',
    bodyBase: '16px',
    bodySm: '14px',
    bodyXs: '12px',
    eyebrow: '11px',
    trackingTight: '-0.025em',
    trackingNormal: '0em',
    trackingEyebrow: '0.2em',
    lineHeightTight: '0.98',
    lineHeightBody: '1.65',
  },
  spacing: {
    sectionPadding: 'clamp(96px, 14vh, 200px)',
    sectionPaddingCompact: 'clamp(64px, 10vh, 120px)',
    containerPadding: 'clamp(20px, 5vw, 80px)',
    containerMax: '1440px',
    editorialGap: 'clamp(32px, 5vw, 64px)',
  },
  radii: {
    sm: '8px',
    md: '16px',
    frame: '20px',
    lg: '24px',
    xl: '32px',
    stage: '40px',
    full: '9999px',
  },
  shadows: {
    soft: '0 20px 40px -15px rgba(10, 10, 10, 0.07)',
    stageFloat: '0 35px 70px -20px rgba(0, 0, 0, 0.55)',
    card: '0 10px 30px -10px rgba(10, 10, 10, 0.05)',
    ochreGlow: '0 0 24px 2px rgba(232, 150, 74, 0.35)',
  },
  motion: {
    durations: {
      micro: 0.2,        // 200ms hover
      stateChange: 0.3,  // 300ms state transitions
      sectionEntry: 0.7, // 700ms entry
      stagger: 0.06,     // 60ms between staggered items
      loopLamp: 4,       // 4s lamp radial pulse
      loopBreathe: 6,    // 6s rule opacity breathe
      loopMagnify: 7,    // 7s circular drift
      loopShimmer: 8,    // 8s path sweep
      loopSky: 20,       // 20s hue breathe
      loopSeal: 60,      // 60s slow rotation
    },
    easings: {
      entry: [0.16, 1, 0.3, 1] as const,
      hover: [0.4, 0, 0.2, 1] as const,
      ambient: 'easeInOut',
    },
  },
} as const;

export type DesignTokens = typeof tokens;
