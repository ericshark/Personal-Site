"use client";

import { useEffect, useRef } from "react";

/*
 * A 2D take on Journey Through Space's starfield (src/starfield.ts): three depth
 * layers drift with the page as it scrolls (parallax), twinkle slowly, and stretch
 * into warp streaks when the page scrolls fast. Arrives with one warp burst.
 * Desktop only (≥1024px); below that theme.css shows a static nebula wash.
 */

const DESKTOP_QUERY = "(min-width: 1024px)";
const STAR_COUNT = 1400;
const LAYERS = [
  { share: 0.6, speed: 0.04, size: [0.6, 1.0], alpha: [0.25, 0.55] },
  { share: 0.3, speed: 0.1, size: [0.9, 1.4], alpha: [0.4, 0.75] },
  { share: 0.1, speed: 0.22, size: [1.3, 1.8], alpha: [0.6, 0.9] },
] as const;
const WARP_THRESHOLD = 900; // px/s of scroll before stars streak
const MAX_STREAK = 90;
const BURST_MS = 600;

type Star = {
  x: number;
  y: number; // 0..1 of the tile height
  speed: number;
  size: number;
  alpha: number;
  color: string;
  twinklePeriod: number;
  twinklePhase: number;
};

/** mulberry32: a tiny seeded RNG, so the sky is the same on every visit. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStars(): Star[] {
  const random = rng(20261119);
  const stars: Star[] = [];
  for (const layer of LAYERS) {
    const count = Math.round(STAR_COUNT * layer.share);
    for (let i = 0; i < count; i++) {
      const tint = random();
      stars.push({
        x: random(),
        y: random(),
        speed: layer.speed,
        size: layer.size[0] + random() * (layer.size[1] - layer.size[0]),
        alpha: layer.alpha[0] + random() * (layer.alpha[1] - layer.alpha[0]),
        color:
          tint < 0.05
            ? "207,230,255"
            : tint < 0.08
              ? "255,226,196"
              : "229,237,241",
        twinklePeriod: 3 + random() * 6,
        twinklePhase: random() * Math.PI * 2,
      });
    }
  }
  return stars;
}

/** A faint, static nebula wash, painted once per resize to an offscreen canvas. */
function paintNebula(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  const blobs: [number, number, number, string][] = [
    [0.2, 0.18, 0.55, "rgba(145,211,231,0.05)"],
    [0.82, 0.8, 0.5, "rgba(120,80,200,0.04)"],
  ];
  for (const [cx, cy, r, color] of blobs) {
    const radius = r * Math.max(width, height);
    const gradient = context.createRadialGradient(
      cx * width,
      cy * height,
      0,
      cx * width,
      cy * height,
      radius,
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }
  return canvas;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvasRef.current;
    const drawingContext = element?.getContext("2d");
    if (!element || !drawingContext) return;
    const canvas = element;
    const context = drawingContext;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const stars = createStars();
    const mountedAt = performance.now();
    let nebula: HTMLCanvasElement | null = null;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let velocity = 0; // smoothed px/s, signed (positive = scrolling down)

    function render(now: number) {
      if (!desktop.matches || document.hidden) return;
      frame = requestAnimationFrame(render);
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime = now;

      // Lenis animates scrollY every frame, so sample it rather than listen.
      const scroll = window.scrollY;
      const instant = (scroll - lastScroll) / dt;
      lastScroll = scroll;
      velocity += (instant - velocity) * (1 - Math.exp(-dt / 0.12));

      const burst = Math.max(0, 1 - (now - mountedAt) / BURST_MS);
      const warp = Math.max(0, Math.abs(velocity) - WARP_THRESHOLD);
      const direction = velocity < 0 ? -1 : 1;
      const time = now / 1000;

      context.clearRect(0, 0, width, height);
      if (nebula) context.drawImage(nebula, 0, 0, width, height);

      for (const star of stars) {
        const x = star.x * width;
        const y =
          (((star.y * height - scroll * star.speed) % height) + height) %
          height;
        const twinkle =
          1 +
          0.15 *
            Math.sin(
              (time / star.twinklePeriod) * Math.PI * 2 + star.twinklePhase,
            );
        const alpha = Math.min(1, star.alpha * twinkle);
        const length = Math.min(
          MAX_STREAK,
          warp * star.speed * 0.06 + MAX_STREAK * burst * (star.speed / 0.22),
        );

        if (length > 1) {
          // Streaks trail behind the direction of travel and fade along their length.
          const gradient = context.createLinearGradient(
            x,
            y,
            x,
            y - length * direction,
          );
          gradient.addColorStop(0, `rgba(${star.color},${alpha})`);
          gradient.addColorStop(1, `rgba(${star.color},0)`);
          context.strokeStyle = gradient;
          context.lineWidth = star.size;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x, y - length * direction);
          context.stroke();
        } else {
          context.fillStyle = `rgba(${star.color},${alpha})`;
          context.fillRect(
            x - star.size / 2,
            y - star.size / 2,
            star.size,
            star.size,
          );
        }
      }
    }

    function resize() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      if (!desktop.matches) {
        canvas.width = 0;
        canvas.height = 0;
        return;
      }
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      nebula = paintNebula(width, height);
      lastScroll = window.scrollY;
      if (!document.hidden) frame = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    desktop.addEventListener("change", resize);
    document.addEventListener("visibilitychange", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      desktop.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} data-ui="df-starfield" aria-hidden="true" />
      <div data-ui="df-vignette" aria-hidden="true" />
    </>
  );
}
