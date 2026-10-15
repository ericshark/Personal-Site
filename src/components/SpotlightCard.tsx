"use client";

import { useRef } from "react";
import { BorderTrail } from "@/components/motion-primitives/border-trail";

/**
 * Card with a soft radial highlight that follows the pointer.
 * Position is written to CSS variables directly to avoid re-rendering on every move.
 * The highlight only shows for hover-capable pointers.
 */
export default function SpotlightCard({
  children,
  className = "",
  trail = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Adds an animated light trail around the border to mark a featured card. */
  trail?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className={`group relative overflow-hidden transition-[transform,border-color] duration-300 hover:border-neutral-300 hover:-translate-y-0.5 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(23 23 23 / 0.07), transparent 70%)",
        }}
      />
      {trail && (
        <BorderTrail
          size={120}
          className="bg-transparent bg-gradient-to-r from-transparent via-neutral-900/25 to-transparent"
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />
      )}
      <div className="relative">{children}</div>
    </article>
  );
}
