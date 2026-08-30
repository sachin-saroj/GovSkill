import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Civic Infrastructure Official Color Tokens
        ink: "#1B2A4A",      // Primary, authority, headers/nav/primary CTA
        marigold: "#D98E2A", // Civic accent, secondary CTA, highlights
        paper: "#F7F5F0",    // Background, letterhead paper tone
        seal: "#A63D40",     // Official stamps, live/active badge accents
        
        // High-End Civic & National Digital Infrastructure Color Palette
        civic: {
          950: "#071322", // Deepest midnight navy
          900: "#0B192C", // Base national navy
          850: "#0F284E", // Elevated navy surface
          800: "#133E87", // Primary heritage navy
          700: "#1E4D8C", // Standard GovSkill brand blue
          600: "#2A69AC",
          500: "#3B82F6",
          400: "#60A5FA",
          300: "#93C5FD",
          200: "#BFDBFE",
          100: "#DBEAFE",
          50: "#EFF6FF",
        },
        saffron: {
          950: "#431407",
          900: "#7C2D12",
          800: "#9A3412",
          700: "#C2410C",
          600: "#D97706", // Civic Saffron Accent
          500: "#F59E0B",
          400: "#FBBF24",
          300: "#FCD34D",
          200: "#FDE68A",
          100: "#FEF3C7",
          50: "#FFFBEB",
        },
        emerald: {
          950: "#022C22",
          900: "#064E3B",
          800: "#065F46",
          700: "#047857",
          600: "#059669", // Civic Verification Green
          500: "#10B981",
          400: "#34D399",
          300: "#6EE7B7",
          200: "#A7F3D0",
          100: "#D1FAE5",
          50: "#ECFDF5",
        },
        // Backward-compatible semantic tokens
        primary: {
          DEFAULT: "#1E4D8C",
          hover: "#163A6B",
          dark: "#0B192C",
          light: "#EFF6FF",
        },
        success: {
          DEFAULT: "#059669",
          hover: "#047857",
          light: "#ECFDF5",
        },
        danger: {
          DEFAULT: "#DC2626",
          hover: "#B91C1C",
          light: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#D97706",
          hover: "#B45309",
          light: "#FFFBEB",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          card: "#FFFFFF",
          elevated: "#FFFFFF",
        },
        appbg: "#F8FAFC",
        textPrimary: "#0F172A",
        textSecondary: "#3D4451",
        textMuted: "#64748B",
        appBorder: "#E2E8F0",
        appBorderStrong: "#CBD5E1",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ['"IBM Plex Sans"', "Inter", "system-ui", "sans-serif"],
        sans: ['"IBM Plex Sans"', "Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ['"IBM Plex Mono"', "JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      perspective: {
        800: "800px",
        1000: "1000px",
        1200: "1200px",
        1500: "1500px",
        2000: "2000px",
      },
      boxShadow: {
        "civic-xs": "0 1px 2px 0 rgba(7, 19, 34, 0.04)",
        "civic-sm": "0 1px 3px 0 rgba(7, 19, 34, 0.06), 0 1px 2px -1px rgba(7, 19, 34, 0.04)",
        "civic-md": "0 4px 6px -1px rgba(7, 19, 34, 0.08), 0 2px 4px -2px rgba(7, 19, 34, 0.04)",
        "civic-lg": "0 10px 15px -3px rgba(7, 19, 34, 0.08), 0 4px 6px -4px rgba(7, 19, 34, 0.03)",
        "civic-xl": "0 20px 25px -5px rgba(7, 19, 34, 0.10), 0 8px 10px -6px rgba(7, 19, 34, 0.04)",
        "civic-glow-blue": "0 0 25px -5px rgba(59, 130, 246, 0.25)",
        "civic-glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        "civic-glow-saffron": "0 0 25px -5px rgba(245, 158, 11, 0.25)",
        "civic-stamp": "0 0 0 2px #A63D40, inset 0 0 0 1px #A63D40",
      },
      borderRadius: {
        "civic-sm": "0.375rem",
        "civic-md": "0.5rem",
        "civic-lg": "0.75rem",
        "civic-xl": "1rem",
        "civic-2xl": "1.25rem",
        "civic-3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2.5s infinite ease-in-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-1500': {
          perspective: '1500px',
        },
        '.perspective-2000': {
          perspective: '2000px',
        },
      });
    }),
  ],
};
