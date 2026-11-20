"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/** The glyph set of Interaction Playground's Matrix rain. */
export const RAIN_GLYPHS = "CODE<>=+*-";
const CYCLE_MS = 40;
const JITTER_MS = 60;

function randomGlyph() {
  return RAIN_GLYPHS[Math.floor(Math.random() * RAIN_GLYPHS.length)];
}

/** Lock times sweep left to right over 500–700ms, with per-character jitter. */
function lockTimes(text: string) {
  const span = Math.min(700, 500 + text.length * 6);
  return [...text].map(
    (_, i) =>
      (text.length > 1 ? (i / (text.length - 1)) * span : 0) +
      (Math.random() * 2 - 1) * JITTER_MS,
  );
}

/**
 * Text that decodes out of scrambled glyphs, after the Matrix demo. Screen readers
 * read the real text; the scramble is aria-hidden. Each scrambled glyph sits in a
 * slot sized by its final character, so proportional fonts don't jitter the line.
 *
 * `trigger="view"` decodes when the text scrolls into view; `"mount"` decodes
 * after `delay` seconds.
 */
export default function DecodeText({
  text,
  trigger = "view",
  delay = 0,
}: {
  text: string;
  trigger?: "view" | "mount";
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -120px 0px",
  });
  const [glyphs, setGlyphs] = useState<(string | null)[] | null>(() =>
    [...text].map((char) => (char === " " ? null : randomGlyph())),
  );
  const play = trigger === "mount" || inView;

  useEffect(() => {
    if (!play) return;
    const locks = lockTimes(text);
    let timer = 0;
    let started = 0;
    const tick = () => {
      const elapsed = performance.now() - started;
      if (locks.every((lock) => elapsed >= lock)) {
        setGlyphs(null);
        return;
      }
      setGlyphs(
        [...text].map((char, i) =>
          char === " " || elapsed >= locks[i] ? null : randomGlyph(),
        ),
      );
      timer = window.setTimeout(tick, CYCLE_MS);
    };
    const start = window.setTimeout(() => {
      started = performance.now();
      tick();
    }, delay * 1000);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(timer);
    };
  }, [play, text, delay]);

  if (glyphs === null) return <span ref={ref}>{text}</span>;

  // Words stay unbreakable so per-character slots can't wrap mid-word.
  let index = 0;
  const words = text.split(" ");
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => {
          const chars = [...word].map((char) => {
            const glyph = glyphs[index++];
            return glyph === null ? (
              char
            ) : (
              <span
                key={index}
                data-ui="pg-glyph"
                className="relative inline-block"
              >
                <span className="invisible">{char}</span>
                <span className="absolute inset-0 text-center">{glyph}</span>
              </span>
            );
          });
          index++; // the space
          return (
            <Fragment key={w}>
              {w > 0 && " "}
              <span className="whitespace-nowrap">{chars}</span>
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}

/** The hero headline: decodes on load, after the default reveal delay. */
export function DecodeHeadline({
  text,
  delay,
}: {
  text: string;
  delay?: number;
}) {
  return <DecodeText text={text} trigger="mount" delay={delay} />;
}
