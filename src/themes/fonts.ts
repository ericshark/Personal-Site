import { Chakra_Petch } from "next/font/google";

/*
 * Theme fonts. `preload: false` keeps them off the default theme's critical path:
 * the @font-face rules ship, but a browser only downloads a font once an element
 * actually renders in it, i.e. while its theme is active (or in a menu swatch).
 */

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
  preload: false,
});

/** Class names that expose every theme font as a CSS variable on <html>. */
export const themeFontVariables = [chakraPetch.variable].join(" ");
