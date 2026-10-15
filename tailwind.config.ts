import type { Config } from "tailwindcss";

const themeColor = (name: string) =>
  `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Channels live in globals.css so each theme can redefine them.
      colors: {
        paper: themeColor("paper"),
        ink: themeColor("ink"),
        accent: themeColor("accent"),
        neutral: {
          100: themeColor("neutral-100"),
          200: themeColor("neutral-200"),
          300: themeColor("neutral-300"),
          400: themeColor("neutral-400"),
          500: themeColor("neutral-500"),
          600: themeColor("neutral-600"),
          700: themeColor("neutral-700"),
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        site: "48rem",
      },
    },
  },
  plugins: [],
};

export default config;
