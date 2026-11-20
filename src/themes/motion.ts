import type { Transition, Variant } from "motion/react";
import type { ThemeId } from "@/themes/registry";

export type RevealPreset = {
  variants: { hidden: Variant; visible: Variant };
  transition: Transition;
};

/**
 * Today's blur-fade-up. Every preset's hidden state must hide the content, because
 * the server always renders this one; swapping presets after hydration then can't
 * flash. Each preset also resets the properties other presets animate.
 */
const blurFade: RevealPreset = {
  variants: {
    hidden: { opacity: 0, x: 0, y: 24, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  },
  transition: { duration: 0.3, ease: "easeInOut" },
};

/**
 * Observatory "boot": wipes in from the left with a power-on flicker. The first
 * opacity keyframe is the current value, so content that is already visible when
 * the theme switches only flickers instead of blinking out. The clip is removed
 * afterwards so link previews can pop out of the row.
 */
const boot: RevealPreset = {
  variants: {
    hidden: {
      opacity: 0,
      x: -14,
      y: 0,
      filter: "blur(0px)",
      clipPath: "inset(0% 100% 0% 0%)",
    },
    visible: {
      opacity: [null, 1, 0.35, 1],
      x: 0,
      y: 0,
      filter: "blur(0px)",
      clipPath: "inset(0% 0% 0% 0%)",
      transitionEnd: { clipPath: "none" },
    },
  },
  transition: {
    duration: 0.6,
    ease: [0.2, 0.8, 0.2, 1],
    opacity: { duration: 0.6, times: [0, 0.4, 0.65, 1], ease: "linear" },
  },
};

/**
 * Playground "block": opacity steps in like a screen redraw rather than easing,
 * with a short rise. Titles inside decode separately (see ThemeText).
 */
const block: RevealPreset = {
  variants: {
    hidden: { opacity: 0, x: 0, y: 8, filter: "blur(0px)" },
    visible: {
      opacity: [null, 0.4, 0.4, 1],
      x: 0,
      y: 0,
      filter: "blur(0px)",
    },
  },
  transition: {
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1],
    opacity: { duration: 0.35, times: [0, 0.34, 0.67, 1], ease: "linear" },
  },
};

const presets: Partial<Record<ThemeId, RevealPreset>> = {
  observatory: boot,
  playground: block,
};

export function revealPreset(id: ThemeId): RevealPreset {
  return presets[id] ?? blurFade;
}
