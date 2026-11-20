"use client";

import { useEffect, useRef, useState } from "react";
import { Fluid, isSoftwareRenderer } from "@/themes/forma/fluid-smoke";

/*
 * Liquid Sculpture's silver smoke (components/smoke-section.tsx), as a fixed
 * full-viewport layer behind the page. The pointer stirs it from anywhere on the
 * page; when the pointer rests, gentle plumes keep it moving. Without WebGL2 (or
 * on a software renderer, or below 1024px) a static silver wash stands in.
 */

const DESKTOP_QUERY = "(min-width: 1024px)";
const SILVER_TONES: [number, number, number][] = [
  [0.82, 0.85, 0.91],
  [0.92, 0.94, 0.98],
  [0.64, 0.68, 0.76],
  [0.75, 0.78, 0.85],
];
// The source's pointer strength, scaled down so the smoke stays behind the text.
const STRENGTH = 0.6;
const POINTER_INTERVAL_MS = 40;
const IDLE_AFTER_MS = 4000;
const IDLE_EVERY_MS = 2500;

export default function SilverSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState<boolean | null>(null);

  // Decide once per mount whether the fluid can run here.
  useEffect(() => {
    setLive(window.matchMedia(DESKTOP_QUERY).matches && !isSoftwareRenderer());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!live || !canvas) return;
    const fluid = Fluid.create(canvas, false);
    if (!fluid) {
      setLive(false);
      return;
    }

    let tone = 0;
    const nextTone = (scale: number) =>
      SILVER_TONES[tone++ % SILVER_TONES.length].map((c) => c * scale) as [
        number,
        number,
        number,
      ];

    // Three rising plumes on arrival.
    for (const seed of [
      { x: 0.24, y: 0.18, dx: 190, dy: 300 },
      { x: 0.56, y: 0.14, dx: -150, dy: 340 },
      { x: 0.8, y: 0.22, dx: -200, dy: 280 },
    ]) {
      fluid.splat(seed.x, seed.y, seed.dx, seed.dy, nextTone(0.26), 1.4);
    }

    const pointer = { x: 0, y: 0, has: false, lastSplat: 0, lastMove: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      if (pointer.has && now - pointer.lastSplat >= POINTER_INTERVAL_MS) {
        const dx = (x - pointer.x) * window.innerWidth;
        const dy = (y - pointer.y) * window.innerHeight;
        fluid.splat(
          x,
          y,
          dx * 6 * STRENGTH,
          dy * 6 * STRENGTH,
          nextTone(0.055 * STRENGTH),
          0.48,
        );
        pointer.lastSplat = now;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.has = true;
      pointer.lastMove = now;
    };
    const onPointerLeave = () => {
      pointer.has = false;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    let frame = 0;
    let last = performance.now();
    let lastIdle = 0;
    const step = (now: number) => {
      frame = requestAnimationFrame(step);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = (now - last) / 1000;
      last = now;
      fluid.resize();
      if (
        now - pointer.lastMove > IDLE_AFTER_MS &&
        now - lastIdle > IDLE_EVERY_MS
      ) {
        lastIdle = now;
        fluid.splat(
          Math.random(),
          Math.random() * 0.4 + 0.1,
          (Math.random() - 0.5) * 300,
          260 + Math.random() * 200,
          nextTone(0.24 * STRENGTH),
          1.4,
        );
      }
      fluid.step(dt);
      fluid.render();
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      // Frees the GL context so switching themes never leaks WebGL contexts.
      fluid.destroy();
    };
  }, [live]);

  return (
    <>
      {live ? (
        <canvas ref={canvasRef} data-ui="forma-smoke" aria-hidden="true" />
      ) : (
        <div data-ui="forma-wash" aria-hidden="true" />
      )}
      <div data-ui="forma-scrim" aria-hidden="true" />
    </>
  );
}
