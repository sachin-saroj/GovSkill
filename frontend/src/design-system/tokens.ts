/**
 * GovSkill Editorial Design System Tokens
 * Source of truth for color, typography, spacing, elevations, and motion curves.
 */

export const tokens = {
  colors: {
    // Core Backgrounds & Typography
    cream: '#F5EFE0',
    creamDeep: '#EDE4D0',
    ink: '#0A0A0A',
    inkMuted: '#6B6357',
    rule: '#D9CFBB',
    stage: '#111111',
    stageText: '#F5EFE0',

    // Section Accents
    accentGreen: '#2A5B4A', // Metric strip only
    accentWarm: '#E8964A',  // Editorial warm dot & CTA glow

    // Strict Editorial Illustration Palette
    terracotta: '#C97B5A',
    olive: '#7B7A4E',
    ochre: '#C9A24A',
    dustyBlue: '#6B8299',
    paper: '#EFE6D2',

    // Semantic Status Systems
    status: {
      success: {
        solid: '#2A5B4A',
        bg: '#2A5B4A1F',
        border: '#2A5B4A4D',
        text: '#1E4537',
      },
      warning: {
        solid: '#C9A24A',
        bg: '#C9A24A26',
        border: '#C9A24A66',
        text: '#7A5B14',
      },
      danger: {
        solid: '#C97B5A',
        bg: '#C97B5A26',
        border: '#C97B5A66',
        text: '#8F3E22',
      },
      info: {
        solid: '#0A0A0A',
        bg: '#EDE4D0',
        border: '#D9CFBB',
        text: '#0A0A0A',
      },
      neutral: {
        solid: '#6B6357',
        bg: '#EFE6D299',
        border: '#D9CFBB',
        text: '#6B6357',
      },
    },

    // Semantic Surfaces
    surfaces: {
      canvas: '#F5EFE0',
      subtle: '#EDE4D0',
      paper: '#EFE6D2',
      pure: '#FFFFFF',
      dark: '#111111',
      darkElevated: '#1A1A1A',
    },

    // Semantic Text
    text: {
      primary: '#0A0A0A',
      secondary: '#6B6357',
      muted: '#8C827A',
      onDark: '#F5EFE0',
      onDarkMuted: '#EDE4D099',
    },

    // Semantic Borders
    borders: {
      subtle: '#D9CFBB80',
      default: '#D9CFBB',
      strong: '#0A0A0A33',
      onDark: 'rgba(255, 255, 255, 0.08)',
    },
  },
  typography: {
    fontSerif: '"Fraunces", Georgia, serif',
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
