import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SmoothScroll from "@/components/SmoothScroll";
import { siteMeta } from "@/data/portfolio";
import { ThemeLayer } from "@/themes/client";
import { themeFontVariables } from "@/themes/fonts";
import { themeInitScript } from "@/themes/init-script";
import { DEFAULT_THEME, getTheme } from "@/themes/registry";
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/themes/observatory/theme.css";
import "@/themes/playground/theme.css";
import "@/themes/deep-field/theme.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
  },
};

export const viewport: Viewport = {
  themeColor: getTheme(DEFAULT_THEME).themeColor,
};

// Motion renders its hidden initial states inline on the server; without
// JavaScript they would never animate in, so force that content visible.
const noScriptRevealStyles =
  '<style>[style*="opacity"]{opacity:1!important;transform:none!important;filter:none!important}</style>';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The inline theme script swaps data-theme (and adds `dark`) before hydration.
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${GeistSans.variable} ${GeistMono.variable} ${themeFontVariables}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript dangerouslySetInnerHTML={{ __html: noScriptRevealStyles }} />
      </head>
      <body className="bg-paper font-sans text-ink antialiased">
        <ThemeLayer />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
