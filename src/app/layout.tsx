import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SmoothScroll from "@/components/SmoothScroll";
import { siteMeta } from "@/data/portfolio";
import { themeColors, themeInitScript } from "@/lib/theme";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
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
  themeColor: themeColors.light,
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
    // The inline theme script adds the `dark` class before hydration.
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript dangerouslySetInnerHTML={{ __html: noScriptRevealStyles }} />
      </head>
      <body className="bg-paper font-sans text-ink antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
