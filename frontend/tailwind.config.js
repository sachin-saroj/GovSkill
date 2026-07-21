/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E4D8C",
          hover: "#163A6B",
        },
        success: "#2E9E6B",
        danger: "#C0392B",
        warning: "#D98E04",
        surface: "#FFFFFF",
        appbg: "#F7F9FB",
        textPrimary: "#1A1F2B",
        textSecondary: "#5A6472",
        appBorder: "#E2E6EB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
