"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import type { HeadlineProps } from "@/themes/client";

const ACCENT_WORDS = 3;

/**
 * Liquid Sculpture's heading pattern: tight sans words, then the last few in an
 * italic silver serif. Words rise slowly out of clipped lines, so the accent
 * words arrive last. Screen readers get the full sentence.
 */
export default function FormaHeadline({ text, delay = 0 }: HeadlineProps) {
  const words = text.split(" ");
  const accentFrom = Math.max(0, words.length - ACCENT_WORDS);
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                data-ui={i >= accentFrom ? "forma-accent" : undefined}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: delay + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}
