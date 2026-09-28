/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GovSkill Internal / Operational Editorial Design System Foundation
        canvas: "#FAF4E4",
        ink: "#121212",
        "on-ink": "#FAF4E4",
        surface: {
          DEFAULT: "#EDE7D9",
          light: "#F5EFDF",
          subtle: "#F7F2E7",
          card: "#EDE7D9",
          hover: "#E4DECF",
          active: "#DAD3C2",
          elevated: "#EDE7D9",
          muted: "#F5EFDF",
        },
        // Civic Semantic Pastel Accents (Intelly-derived, GovSkill domain mapped)
        sage: {
          DEFAULT: "#98AD60",
          soft: "#E8EED8",
          dark: "#2D4512",
          border: "#98AD6080",
        },
        azure: {
          DEFAULT: "#B6CAEB",
          soft: "#E3ECF8",
          dark: "#14325E",
          border: "#B6CAEB99",
        },
        gold: {
          DEFAULT: "#F6D868",
          soft: "#FBF1C9",
          dark: "#594102",
          border: "#F6D86899",
        },
        rose: {
          DEFAULT: "#F5B8DA",
          soft: "#FBE9F2",
          dark: "#5C163C",
          border: "#F5B8DA99",
        },
        // WCAG AA safe text colors on canvas/surface
        "text-primary": "#121212",
        "text-secondary": "#2D2A28",
        "text-muted-aa": "#6F6759", // ~5:1 on canvas
        "border-frame": "#3A3835",
        "border-subtle": "#E8E2D4",
        "border-default": "#DCD5C5",
        "border-warm": "#DCD5C5",
        border: {
          warm: "#DCD5C5",
          subtle: "#E8E2D4",
          frame: "#3A3835",
          default: "#DCD5C5",
        },

        // Legacy / Editorial compatibility tokens
        "ink-muted": "#6F6759",
        "ink-subtle": "#9E9585",
        "ink-border": "#DCD5C5",
        "accent-rust": "#D9457F",
        "accent-orange": "#F6D868",
        "accent-blue": "#B6CAEB",

        // Backward-compatible Editorial Tokens
        editorial: {
          cream: "#FAF4E4",
          creamDeep: "#EDE7D9",
          paper: "#EDE7D9",
          ink: "#121212",
          inkMuted: "#6F6759",
          inkSubtle: "#9E9585",
          rule: "#DCD5C5",
          stage: "#121212",
          stageText: "#FAF4E4",
          green: "#98AD60",
          warm: "#F6D868",
          terracotta: "#D9457F",
          ochre: "#F6D868",
          dustyBlue: "#B6CAEB",
          olive: "#52525B",
        },
        // Target Design Token Architecture
        brand: {
          DEFAULT: "#121212",
          hover: "#2A2A2A",
          surface: "#EDE7D9",
          border: "#DCD5C5",
        },
        // Civic palette remapped to pure ink & cobalt
        civic: {
          950: "#000000",
          900: "#09090B",
          850: "#18181B",
          800: "#0E50B0",
          700: "#0E50B0",
          600: "#2563EB",
          500: "#3B82F6",
          400: "#60A5FA",
          300: "#93C5FD",
          200: "#BFDBFE",
          100: "#EFF6FF",
          50: "#F8FAFC",
        },
        saffron: {
          950: "#431407",
          900: "#7C2D12",
          800: "#AF411E",
          700: "#C2410C",
          600: "#EE8148",
          500: "#F59E0B",
          400: "#FBBF24",
          300: "#FCD34D",
          200: "#FED7AA",
          100: "#FFEDD5",
          50: "#FFF7ED",
        },
        emerald: {
          950: "#022C22",
          900: "#064E3B",
          800: "#065F46",
          700: "#047857",
          600: "#059669",
          500: "#10B981",
          400: "#34D399",
          300: "#6EE7B7",
          200: "#A7F3D0",
          100: "#D1FAE5",
          50: "#ECFDF5",
        },
        // Backward-compatible semantic tokens
        primary: {
          DEFAULT: "#0E50B0",
          hover: "#0A3C85",
          dark: "#000000",
          light: "#EFF6FF",
        },
        success: {
          DEFAULT: "#15803D",
          hover: "#166534",
          light: "#F0FDF4",
        },
        danger: {
          DEFAULT: "#AF411E",
          hover: "#991B1B",
          light: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#EE8148",
          hover: "#C2410C",
          light: "#FFF7ED",
        },
        appbg: "#FFFFFF",
        textPrimary: "#000000",
        textSecondary: "#71717A",
        textMuted: "#A1A1AA",
        appBorder: "#E4E4E7",
        appBorderStrong: "#000000",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "Times New Roman", "serif"],
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      fontSize: {
        hero: ["36px", { lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.03em" }],
        "page-title": ["30px", { lineHeight: "1.15", fontWeight: "800", letterSpacing: "-0.025em" }],
        "section-heading": ["22px", { lineHeight: "1.25", fontWeight: "700", letterSpacing: "-0.02em" }],
        body: ["15px", { lineHeight: "1.55", fontWeight: "400" }],
        btn: ["14px", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.02em" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "500" }],
        micro: ["11px", { lineHeight: "1.3", fontWeight: "700", letterSpacing: "0.2em" }],
      },
      boxShadow: {
        "editorial-soft": "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        "editorial-card": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "editorial-stage": "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        "editorial-glow": "0 0 20px 2px rgba(238, 129, 72, 0.2)",
        "editorial-mint-glow": "0 0 20px 2px rgba(14, 80, 176, 0.2)",
        "civic-xs": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "civic-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        "civic-md": "0 4px 6px -1px rgba(0, 0, 0, 0.06)",
        "civic-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
        "civic-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        "civic-glow-blue": "0 0 25px -5px rgba(14, 80, 176, 0.25)",
        "civic-glow-emerald": "0 0 25px -5px rgba(21, 128, 61, 0.25)",
        "civic-glow-saffron": "0 0 25px -5px rgba(238, 129, 72, 0.25)",
      },
      borderRadius: {
        // Intelly-derived geometric radius system
        "xs": "6px",
        "sm": "12px",
        "md": "16px",
        "lg": "20px",
        "xl": "24px",
        "2xl": "28px",
        "full": "9999px",
        // Backward-compatible tokens
        "editorial-sm": "0.25rem", // 4px
        "editorial-md": "0.375rem", // 6px
        "editorial-card": "0.5rem", // 8px
        "editorial-feature": "0.75rem", // 12px
        "editorial-stage": "1rem", // 16px
        "editorial-hero": "1.25rem", // 20px
        "editorial-full": "9999px",
        "civic-sm": "0.25rem",
        "civic-md": "0.375rem",
        "civic-lg": "0.5rem",
        "civic-xl": "0.75rem",
        "civic-2xl": "1rem",
        "civic-3xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "slide-up": "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2.5s infinite ease-in-out",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(3px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};
