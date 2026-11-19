"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useThemeId } from "@/themes/use-theme";

const TICK_MS = 900;
// A plain integer with an optional "+" (74, 130+). Anything else just appears.
const COUNTABLE = /^(\d+)(\+?)$/;

/**
 * A case-study metric value. In Observatory, countable values tick up from 0 the
 * first time they scroll into view. The real value stays in the DOM for screen
 * readers; the animated number is decorative.
 */
export default function MetricValue({ value }: { value: string }) {
  const theme = useThemeId();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const match = COUNTABLE.exec(value);
  const ticks = theme === "observatory" && match !== null;
  const target = match ? Number(match[1]) : 0;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!ticks || !inView) return;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / TICK_MS);
      setShown(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [ticks, inView, target]);

  // One stable outer element: useInView keeps observing the node it first saw.
  return (
    <span ref={ref}>
      {ticks ? (
        <>
          <span className="sr-only">{value}</span>
          <span aria-hidden="true">
            {shown}
            {match?.[2]}
          </span>
        </>
      ) : (
        value
      )}
    </span>
  );
}
