"use client";

import {
  Suspense,
  lazy,
  useEffect,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import SplitWords from "@/components/SplitWords";
import type { ThemeId } from "@/themes/registry";
import { syncThemeColor, useThemeId } from "@/themes/use-theme";

/** Props every headline effect receives; it must keep `text` readable to screen readers. */
export type HeadlineProps = { text: string; delay?: number };

/** Serializable data a server component hands to a theme slot. */
export type SlotProps = { data?: unknown };

type Lazy<P> = LazyExoticComponent<ComponentType<P>>;

/**
 * Per-theme client modules. Everything is lazy, so a theme's code is fetched only
 * while that theme is active. Slot components must not import src/data/portfolio.ts;
 * they get what they need through <ThemeSlot data>.
 */
type ThemeClientModule = {
  /** Fixed decoration behind the page content. */
  Background?: Lazy<object>;
  /** Fixed decoration above the page content. */
  Overlay?: Lazy<object>;
  /** Replaces the hero headline's default word rise. */
  headline?: Lazy<HeadlineProps>;
  slots?: Partial<Record<SlotName, Lazy<SlotProps>>>;
};

export type SlotName = "hero-kicker-extra";

const modules: Partial<Record<ThemeId, ThemeClientModule>> = {
  observatory: {
    Background: lazy(() => import("@/themes/observatory/Globe")),
    headline: lazy(() => import("@/themes/observatory/TypedHeadline")),
    slots: {
      "hero-kicker-extra": lazy(() => import("@/themes/observatory/UtcClock")),
    },
  },
};

/** Mounted once in the root layout: the active theme's background and overlay. */
export function ThemeLayer() {
  const theme = useThemeId();
  const { Background, Overlay } = modules[theme] ?? {};

  // The init script may run before Next renders the theme-color meta tag.
  useEffect(() => {
    syncThemeColor(theme);
  }, [theme]);

  return (
    <Suspense fallback={null}>
      {Background && <Background key={`${theme}-bg`} />}
      {Overlay && <Overlay key={`${theme}-overlay`} />}
    </Suspense>
  );
}

/** Renders the active theme's component for a named slot, or nothing. */
export function ThemeSlot({ name, data }: { name: SlotName; data?: unknown }) {
  const theme = useThemeId();
  const Slot = modules[theme]?.slots?.[name];
  if (!Slot) return null;
  return (
    <Suspense fallback={null}>
      <Slot data={data} />
    </Suspense>
  );
}

/** The hero headline: the active theme's effect, or the default word rise. */
export function HeroHeadline({ text, delay }: HeadlineProps) {
  const theme = useThemeId();
  const Effect = modules[theme]?.headline;
  if (!Effect) return <SplitWords text={text} delay={delay} />;
  return (
    // Holds the headline's space while the effect's code loads.
    <Suspense fallback={<span className="invisible">{text}</span>}>
      <Effect key={theme} text={text} delay={delay} />
    </Suspense>
  );
}
