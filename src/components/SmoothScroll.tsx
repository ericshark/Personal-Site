"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Initializes Lenis smooth scrolling for the whole page.
 * Intentionally runs even under prefers-reduced-motion.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis();

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Lenis's built-in `anchors` option doesn't preventDefault, so the browser's
    // native hash jump fights the animation. Handle same-page anchors ourselves.
    function onAnchorClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const hash = link?.getAttribute("href");
      if (!hash) return;

      const target =
        hash === "#" || hash === "#top"
          ? 0
          : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target === null) return;

      event.preventDefault();
      lenis.scrollTo(target, {
        duration: 1.1,
        easing: easeOutExpo,
      });
      if (window.location.hash !== hash) {
        history.pushState(null, "", hash);
      }
    }

    document.addEventListener("click", onAnchorClick, { capture: true });

    return () => {
      document.removeEventListener("click", onAnchorClick, { capture: true });
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
