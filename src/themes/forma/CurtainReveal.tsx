"use client";

import { useEffect, useRef } from "react";

/**
 * Drives Forma's image curtain on its parent (a project thumbnail or the case
 * study's main image): the frame opens from the bottom up while the image eases
 * down from 1.08 scale (CSS in theme.css). It marks the parent with
 * data-curtain="closed", then "open" once the parent is on screen. Renders
 * only an invisible marker.
 */
export default function CurtainReveal() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    parent.dataset.curtain = "closed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // One frame later, so the closed state paints before it opens.
        requestAnimationFrame(() => {
          parent.dataset.curtain = "open";
        });
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(parent);
    return () => {
      observer.disconnect();
      delete parent.dataset.curtain;
    };
  }, []);

  return <span ref={ref} hidden />;
}
