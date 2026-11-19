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
        surface: themeColor("surface"),
        ink: themeColor("ink"),
        accent: themeColor("accent"),
        "accent-2": themeColor("accent-2"),
        signal: themeColor("signal"),
        danger: themeColor("danger"),
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
      // Each theme points these at its own fonts (see globals.css and src/themes).
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-label)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        site: "48rem",
      },
    },
  },
  plugins: [],
};

export default config;
