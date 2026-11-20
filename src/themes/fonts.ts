import {
  Chakra_Petch,
  JetBrains_Mono,
  Newsreader,
  Schibsted_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";

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

// Playground: free stand-ins for Interaction Playground's commercial STK Bureau
// Serif and Die Grotesk (see docs/tickets/site-themes/README.md), plus Departure
// Mono (SIL OFL, licence beside the file).
const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
  preload: false,
});

const departureMono = localFont({
  src: "./playground/fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure",
  display: "swap",
  preload: false,
});

// Deep Field: Journey Through Space sets everything in JetBrains Mono.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

/** Class names that expose every theme font as a CSS variable on <html>. */
export const themeFontVariables = [
  chakraPetch.variable,
  newsreader.variable,
  schibstedGrotesk.variable,
  departureMono.variable,
  jetbrainsMono.variable,
].join(" ");
