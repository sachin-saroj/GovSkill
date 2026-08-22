/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Civic Modern Color System
        civic: {
          950: "#071322",
          900: "#0B2545", // Deep National Navy
          800: "#133E87", // Primary Heritage Navy
          700: "#1E4D8C", // Standard GovSkill Blue
          600: "#2A69AC",
          500: "#3B82F6",
          400: "#60A5FA",
          200: "#BFDBFE",
          100: "#DBEAFE",
          50: "#EFF6FF",
        },
        saffron: {
          900: "#7C2D12",
          800: "#9A3412",
          700: "#C2410C",
          600: "#D97706", // Civic Saffron Accent
          500: "#F59E0B",
          400: "#FBBF24",
          100: "#FEF3C7",
          50: "#FFFBEB",
        },
        emerald: {
          900: "#064E3B",
          800: "#065F46",
          700: "#047857",
          600: "#059669", // Civic Verification Green
          500: "#10B981",
          100: "#D1FAE5",
          50: "#ECFDF5",
        },
        // Backward-compatible semantic tokens
        primary: {
          DEFAULT: "#1E4D8C",
          hover: "#163A6B",
          dark: "#0B2545",
          light: "#EFF6FF",
        },
        success: {
          DEFAULT: "#107C41",
          hover: "#0E6B38",
          light: "#ECFDF5",
        },
        danger: {
          DEFAULT: "#C0392B",
          hover: "#9B2D22",
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
        },
        appbg: "#F8FAFC",
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        textMuted: "#64748B",
        appBorder: "#E2E8F0",
        appBorderStrong: "#CBD5E1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        "civic-xs": "0 1px 2px 0 rgba(11, 37, 69, 0.04)",
        "civic-sm": "0 1px 3px 0 rgba(11, 37, 69, 0.06), 0 1px 2px -1px rgba(11, 37, 69, 0.04)",
        "civic-md": "0 4px 6px -1px rgba(11, 37, 69, 0.08), 0 2px 4px -2px rgba(11, 37, 69, 0.04)",
        "civic-lg": "0 10px 15px -3px rgba(11, 37, 69, 0.08), 0 4px 6px -4px rgba(11, 37, 69, 0.03)",
        "civic-xl": "0 20px 25px -5px rgba(11, 37, 69, 0.10), 0 8px 10px -6px rgba(11, 37, 69, 0.04)",
      },
      borderRadius: {
        "civic-sm": "0.375rem",
        "civic-md": "0.5rem",
        "civic-lg": "0.75rem",
        "civic-xl": "1rem",
        "civic-2xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
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
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
