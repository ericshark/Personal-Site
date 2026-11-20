"use client";

import { useEffect, useRef, useState } from "react";
import { RAIN_GLYPHS } from "@/themes/playground/DecodeText";

const CELL = 11;
const DURATION_MS = 600;
const SPLIT_MS = 120;

/**
 * Covers its (positioned) parent with a grid of Matrix glyphs, then clears the
 * cells in random order to reveal the image underneath, with the Matrix demo's
 * pink/cyan chromatic split in the first moments. Starts when the parent scrolls
 * into view and removes itself when done.
 */
export default function AsciiDissolve() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent || !context) return;

    const styles = getComputedStyle(parent);
    const paper = `rgb(${styles.getPropertyValue("--color-paper").trim().replace(/ /g, ",")})`;
    const ink = styles
      .getPropertyValue("--color-ink")
      .trim()
      .replace(/ /g, ",");
    const { width, height } = parent.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.font = `${CELL * 0.82}px "Geist Mono", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const columns = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    const cells = Array.from({ length: columns * rows }, () => ({
      glyph: RAIN_GLYPHS[Math.floor(Math.random() * RAIN_GLYPHS.length)],
      clearAt: Math.random() * DURATION_MS * 0.9,
    }));

    function draw(elapsed: number) {
      context!.clearRect(0, 0, width, height);
      const split = elapsed < SPLIT_MS ? (1 - elapsed / SPLIT_MS) * 6 : 0;
      const layers: [number, string][] = split
        ? [
            [-split, "rgba(255,40,110,0.45)"],
            [split, "rgba(0,190,255,0.45)"],
            [0, `rgba(${ink},0.6)`],
          ]
        : [[0, `rgba(${ink},0.6)`]];
      cells.forEach((cell, i) => {
        if (elapsed >= cell.clearAt) return;
        const x = (i % columns) * CELL;
        const y = Math.floor(i / columns) * CELL;
        context!.fillStyle = paper;
        context!.fillRect(x, y, CELL, CELL);
      });
      for (const [shift, color] of layers) {
        context!.fillStyle = color;
        cells.forEach((cell, i) => {
          if (elapsed >= cell.clearAt) return;
          const x = (i % columns) * CELL + CELL / 2 + shift;
          const y = Math.floor(i / columns) * CELL + CELL / 2;
          context!.fillText(cell.glyph, x, y);
        });
      }
    }

    draw(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const elapsed = now - start;
          if (elapsed >= DURATION_MS) {
            setDone(true);
            return;
          }
          draw(elapsed);
          frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      // Plays once the image is clearly on screen.
      { rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(parent);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  if (done) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
}
