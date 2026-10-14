"use client";

import { useEffect, useRef } from "react";

const TRAIL_COPIES = 48;
// How far the word travels downward over the whole finale, in viewport heights.
const TRAVEL = 0.4;
const LINK_FADE_START = 0.9;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Scroll-driven finale: one "Thank you." starts high, then slides downward
 * as you scroll, stamping white outlined copies of itself behind the black
 * front word. Runs regardless of prefers-reduced-motion, like SmoothScroll.
 */
export default function ThankYou() {
  const root = useRef<HTMLElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const backLink = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = root.current;
    const trailElement = trail.current;
    const headElement = head.current;
    const link = backLink.current;
    if (!section || !trailElement || !headElement || !link) return;
    const copies = Array.from(trailElement.children) as HTMLElement[];
    let frame = 0;

    function update() {
      frame = 0;
      const rect = section!.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? clamp(-rect.top / distance) : 1;
      const offset = (p: number) => p * TRAVEL * window.innerHeight;

      headElement!.style.transform = `translate(-50%, -50%) translateY(${offset(progress)}px)`;
      // Each copy is stamped where the head was when progress passed its
      // birth point, so scrolling back up removes them in reverse order.
      copies.forEach((copy, i) => {
        const birth = (i + 1) / (TRAIL_COPIES + 1);
        if (progress >= birth) {
          copy.style.visibility = "visible";
          copy.style.transform = `translate(-50%, -50%) translateY(${offset(birth)}px)`;
        } else {
          copy.style.visibility = "hidden";
        }
      });

      const linkOpacity = clamp(
        (progress - LINK_FADE_START) / (1 - LINK_FADE_START),
      );
      link!.style.opacity = String(linkOpacity);
      link!.style.pointerEvents = linkOpacity > 0.5 ? "auto" : "none";
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      headElement.removeAttribute("style");
      copies.forEach((copy) => copy.removeAttribute("style"));
      link.removeAttribute("style");
    };
  }, []);

  return (
    <section
      id="thank-you"
      ref={root}
      aria-labelledby="thank-you-title"
      className="relative h-[500svh]"
    >
      <div className="sticky top-0 z-[60] h-svh overflow-hidden bg-paper">
        <h2 id="thank-you-title" className="sr-only">
          Thank you.
        </h2>

        <div ref={trail} aria-hidden="true">
          {Array.from({ length: TRAIL_COPIES }, (_, i) => (
            <div key={i} className="thank-you-copy">
              Thank you.
            </div>
          ))}
        </div>
        <div ref={head} aria-hidden="true" className="thank-you-head">
          Thank you.
        </div>

        <p
          ref={backLink}
          className="pointer-events-none absolute inset-x-0 bottom-10 text-center font-mono text-sm opacity-0"
        >
          <a href="#top">Back to the start ↑</a>
        </p>
      </div>
    </section>
  );
}
