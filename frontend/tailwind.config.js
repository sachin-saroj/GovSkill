/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial Civic Design Foundation Tokens
        editorial: {
          cream: "#F5EFE0",
          creamDeep: "#EDE4D0",
          paper: "#EFE6D2",
          ink: "#0A0A0A",
          inkMuted: "#6B6357",
          inkSubtle: "#8C827A",
          rule: "#D9CFBB",
          stage: "#111111",
          stageText: "#F5EFE0",
          green: "#2A5B4A",
          warm: "#E8964A",
          terracotta: "#C97B5A",
          ochre: "#C9A24A",
          dustyBlue: "#6B8299",
          olive: "#7B7A4E",
        },
        // Target Design Token Architecture
        brand: {
          DEFAULT: "#1E40AF",
          hover: "#1E3A8A",
          surface: "#FAFAFA",
          border: "#E5E5E5",
        },
        // Cohesive Canvas Design System (CCDS) Primary Tokens
        ccds: {
          backdrop: "#EAECEF",
          canvas: "#FFFFFF",
          subtle: "#F8FAFC",
          border: "#F1F5F9",
          textPrimary: "#0A0A0A",
          textBody: "#525252",
          textMuted: "#94A3B8",
          mint: {
            DEFAULT: "#3BB78F",
            glow: "#47D1A5",
            hover: "#34A580",
          },
          teal: {
            dark: "#1F7A8C",
            lumina: "#2DD4BF",
          },
          coral: {
            DEFAULT: "#FF6B4A",
            hover: "#FA5A3C",
            light: "#FFF1EE",
          },
          gold: {
            DEFAULT: "#FFB800",
            hover: "#E5A600",
            light: "#FFF9E6",
          },
          cyan: {
            DEFAULT: "#0EA5E9",
            light: "#E0F2FE",
            dark: "#0369A1",
          },
        },
        accent: {
          mint: "#A7F3D0",
          "mint-text": "#065F46",
          "mint-bg": "#ECFDF5",
          yellow: "#FEF08A",
          "yellow-text": "#854D0E",
          "yellow-bg": "#FEFCE8",
          cyan: "#A5F3FC",
          "cyan-text": "#155E75",
          "cyan-bg": "#ECFEFF",
        },
        // High-End Civic & National Digital Infrastructure Color Palette
        civic: {
          950: "#071322", // Deepest midnight navy
          900: "#0B192C", // Base national navy
          850: "#0F284E", // Elevated navy surface
          800: "#133E87", // Primary heritage navy
          700: "#1E40AF", // Aligned with target primary #1E40AF
          600: "#2563EB",
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
          DEFAULT: "#1E40AF",
          hover: "#1E3A8A",
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
          subtle: "#FAFAFA",
          card: "#FFFFFF",
          elevated: "#FFFFFF",
          muted: "#F4F4F5",
        },
        appbg: "#FAFAFA",
        textPrimary: "#0A0A0A",
        textSecondary: "#525252",
        textMuted: "#A3A3A3",
        appBorder: "#E5E5E5",
        appBorderStrong: "#D4D4D8",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      fontSize: {
        hero: ["32px", { lineHeight: "1.15", fontWeight: "600" }],
        "page-title": ["30px", { lineHeight: "1.2", fontWeight: "600" }],
        "section-heading": ["21px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["15px", { lineHeight: "1.5", fontWeight: "400" }],
        btn: ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "500" }],
        micro: ["12px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "0.05em" }],
      },
      boxShadow: {
        "editorial-soft": "0 20px 40px -15px rgba(10, 10, 10, 0.07)",
        "editorial-card": "0 10px 30px -10px rgba(10, 10, 10, 0.05)",
        "editorial-stage": "0 35px 70px -20px rgba(0, 0, 0, 0.55)",
        "editorial-glow": "0 0 24px 2px rgba(232, 150, 74, 0.35)",
        "editorial-mint-glow": "0 0 24px 2px rgba(42, 91, 74, 0.25)",
        "civic-xs": "0 1px 2px 0 rgba(7, 19, 34, 0.04)",
        "civic-sm": "0 1px 3px 0 rgba(7, 19, 34, 0.05), 0 1px 2px -1px rgba(7, 19, 34, 0.03)",
        "civic-md": "0 4px 6px -1px rgba(7, 19, 34, 0.06), 0 2px 4px -2px rgba(7, 19, 34, 0.03)",
        "civic-lg": "0 10px 15px -3px rgba(7, 19, 34, 0.07), 0 4px 6px -4px rgba(7, 19, 34, 0.02)",
        "civic-xl": "0 20px 25px -5px rgba(7, 19, 34, 0.08), 0 8px 10px -6px rgba(7, 19, 34, 0.03)",
        "civic-glow-blue": "0 0 25px -5px rgba(59, 130, 246, 0.25)",
        "civic-glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        "civic-glow-saffron": "0 0 25px -5px rgba(245, 158, 11, 0.25)",
      },
      borderRadius: {
        "editorial-sm": "0.5rem", // 8px
        "editorial-md": "0.75rem", // 12px
        "editorial-card": "1.25rem", // 20px
        "editorial-feature": "1.75rem", // 28px
        "editorial-stage": "2.25rem", // 36px
        "editorial-hero": "2.75rem", // 44px
        "editorial-full": "9999px",
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
  plugins: [],
};
