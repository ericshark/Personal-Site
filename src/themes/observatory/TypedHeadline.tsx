"use client";

import { useEffect, useState } from "react";
import type { HeadlineProps } from "@/themes/client";

const CHAR_MS = 18;
const BLINK_MS = 400;
const BLINKS_AFTER = 3;

/**
 * Types the headline in behind a blinking block cursor. The untyped remainder is
 * laid out but invisible, so the headline never changes size while typing.
 */
export default function TypedHeadline({ text, delay = 0 }: HeadlineProps) {
  const [typed, setTyped] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setTyped((count) => {
          if (count >= text.length) {
            window.clearInterval(interval);
            return count;
          }
          return count + 1;
        });
      }, CHAR_MS);
    }, delay * 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [text, delay]);

  useEffect(() => {
    if (typed < text.length) return;
    let toggles = 0;
    const blink = window.setInterval(() => {
      toggles += 1;
      setCursorOn((on) => !on);
      if (toggles >= BLINKS_AFTER * 2) {
        window.clearInterval(blink);
        setDone(true);
      }
    }, BLINK_MS);
    return () => window.clearInterval(blink);
  }, [typed, text.length]);

  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, typed)}
        {!done && (
          <span
            data-ui="type-cursor"
            className="inline-block w-0 overflow-visible whitespace-nowrap"
            style={{ opacity: cursorOn ? 1 : 0 }}
          >
            ▌
          </span>
        )}
        <span className="invisible">{text.slice(typed)}</span>
      </span>
    </span>
  );
}
