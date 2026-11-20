"use client";

import { AnimatePresence, motion } from "motion/react";

// Interaction Playground's `snappy` spring (src/core.tsx).
const snappy = { type: "spring" as const, stiffness: 420, damping: 34 };

/**
 * Each character rolls to its new value when the text changes. Ported from
 * Interaction Playground's RollingText (src/core.tsx).
 */
export default function RollingText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex whitespace-pre ${className}`}>
      {[...text].map((char, i) => (
        <span key={i} className="relative inline-block overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={char}
              className="inline-block"
              initial={{ y: "90%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-90%", opacity: 0 }}
              transition={snappy}
            >
              {char === " " ? " " : char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

/**
 * An action label whose characters roll over on hover (CSS in theme.css). The
 * second copy is aria-hidden, so the label's text is read once.
 */
export function RollLabel({ text }: { text: string }) {
  return (
    <span data-ui="pg-roll">
      {[...text].map((char, i) => {
        const shown = char === " " ? " " : char;
        return (
          <span
            key={i}
            data-ui="pg-roll-char"
            style={{ "--i": i } as React.CSSProperties}
          >
            <span>{shown}</span>
            <span aria-hidden="true">{shown}</span>
          </span>
        );
      })}
    </span>
  );
}
