"use client";

import { InView } from "@/components/motion-primitives/in-view";
import { revealPreset } from "@/themes/motion";
import { useThemeId } from "@/themes/use-theme";

/**
 * Reveals content as it scrolls into view, in the active theme's style
 * (default: blur-and-fade-up, the motion-primitives InView "Basic" example).
 * Plays regardless of prefers-reduced-motion (see CLAUDE.md).
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { variants, transition } = revealPreset(useThemeId());
  return (
    <InView
      variants={variants}
      viewOptions={{ margin: "0px 0px -200px 0px" }}
      transition={{ ...transition, delay }}
      once
    >
      <div className={className}>{children}</div>
    </InView>
  );
}
