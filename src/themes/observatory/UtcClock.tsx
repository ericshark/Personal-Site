"use client";

import { useEffect, useState } from "react";

/** A live HH:MM:SS UTC readout for the hero kicker, as in World Observatory's top bar. */
export default function UtcClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!time) return null;
  return (
    <span data-ui="obs-clock" aria-hidden="true">
      {" "}
      · {time} UTC
    </span>
  );
}
