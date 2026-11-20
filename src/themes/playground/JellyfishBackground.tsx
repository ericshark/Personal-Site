"use client";

/*
 * Ported from ~/GitHub/design/interaction-playground/src/components/JellyfishBackground.tsx.
 * Three ASCII jellyfish swim through the page margins: desktop only (≥1024px),
 * capped at 30fps, paused while the tab is hidden. Light palette only.
 */

import { useEffect, useRef } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";
const FRAME_INTERVAL = 1000 / 30;
const CHARACTERS = ".:=+*#";
// Interaction Playground's light palette; the Playground theme has no dark variant.
const PALETTE = ["#b5b8bc", "#979ca2", "#767e86", "#59636d"];
const jellyfish = [
  { phase: -0.65, period: 58, depth: 0.3, scale: 1.12 },
  { phase: 2.5, period: 71, depth: 0.61, scale: 0.92 },
  { phase: 4.15, period: 83, depth: 0.51, scale: 1.28 },
];
type Jellyfish = (typeof jellyfish)[number];
type Glyph = { x: number; y: number; character: string; shade: number };

function createBell(): Glyph[] {
  const glyphs: Glyph[] = [];
  for (let y = -60; y <= 5; y += 5) {
    for (let x = -60; x <= 60; x += 4) {
      const radius = Math.hypot(x / 60, y / 60);
      if (radius > 1 || y > 2 + Math.cos(x * 0.19) * 3) continue;
      const grain = Math.abs(Math.sin(x * 12.9898 + y * 78.233));
      const rib = Math.cos(Math.atan2(x, -y + 8) * 9) ** 8;
      const rim = y >= -5 || radius > 0.87;
      glyphs.push({
        x,
        y,
        character: rim
          ? grain > 0.5
            ? "+"
            : ":"
          : CHARACTERS[Math.floor(grain * CHARACTERS.length)],
        shade: rim
          ? 3
          : Math.min(2, Math.floor(grain + rib * 1.5 + radius * 0.7)),
      });
    }
  }
  return glyphs;
}

function swimmingPose(
  fish: Jellyfish,
  time: number,
  width: number,
  height: number,
) {
  const angle = (time / fish.period) * Math.PI * 2 + fish.phase;
  // Keep the complete creature outside the viewport when its path turns.
  const horizontalRadius = width / 2 + 320;
  const verticalWave = angle * 2 + fish.phase;
  return {
    x: width / 2 + Math.sin(angle) * horizontalRadius,
    y: height * (fish.depth + Math.sin(verticalWave) * 0.22),
    heading: Math.atan2(
      height * 0.44 * Math.cos(verticalWave),
      horizontalRadius * Math.cos(angle),
    ),
  };
}

function drawJellyfish(
  context: CanvasRenderingContext2D,
  bell: Glyph[],
  fish: Jellyfish,
  time: number,
  width: number,
  height: number,
  palette: string[],
) {
  const pose = swimmingPose(fish, time, width, height);
  const pulse = Math.sin(time * 2.1 + fish.phase);
  context.save();
  context.translate(pose.x, pose.y);
  // Local -Y points through the bell; rotate it into the direction of travel.
  context.rotate(pose.heading + Math.PI / 2);
  context.scale(fish.scale, fish.scale);
  context.font = "7px monospace";

  for (let strand = 0; strand < 11; strand++) {
    const root = (strand - 5) * 9;
    const length =
      92 + Math.cos(strand * 2.3) * 25 + (5 - Math.abs(strand - 5)) * 10;
    for (let y = 5; y < length; y += 5) {
      const progress = y / length;
      const wave = Math.sin(y * 0.055 - time * 2.1 + strand * 0.7 + fish.phase);
      const x =
        root * (1 - progress * 0.35) * (1 + pulse * 0.06) +
        wave * (3 + progress * 16);
      context.globalAlpha = (1 - progress * 0.7) * (strand % 2 ? 0.55 : 0.75);
      context.fillStyle = palette[strand % 3];
      context.fillText(y % 15 === 0 ? ":" : ".", x, y);
      // Fuller, ruffled oral arms give the center a different texture to the fine tendrils.
      if (strand >= 4 && strand <= 6 && progress < 0.75) {
        context.fillText(
          progress < 0.4 ? "+" : ":",
          x + Math.cos(y * 0.3 - time) * 4,
          y,
        );
      }
    }
  }

  context.globalAlpha = 0.7;
  for (const glyph of bell) {
    context.fillStyle = palette[glyph.shade];
    const x = glyph.x * (1 + pulse * 0.085);
    const y =
      glyph.y * (1 - pulse * 0.06) +
      Math.cos(glyph.x * 0.12 + time * 2.1) * 1.2;
    context.fillText(glyph.character, x, y);
  }
  context.restore();
}

export default function JellyfishBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvasRef.current;
    const drawingContext = element?.getContext("2d");
    if (!element || !drawingContext) return;
    const canvas = element;
    const context = drawingContext;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const bell = createBell();
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTick: number | null = null;
    let lastDraw = -FRAME_INTERVAL;
    let elapsed = 0;

    function render(timestamp: number) {
      if (!desktop.matches || document.hidden) return;
      frame = requestAnimationFrame(render);
      // Accumulate only active time so a hidden tab resumes without a leap.
      if (lastTick !== null) elapsed += timestamp - lastTick;
      lastTick = timestamp;
      if (timestamp - lastDraw < FRAME_INTERVAL) return;
      lastDraw = timestamp - ((timestamp - lastDraw) % FRAME_INTERVAL);
      context.clearRect(0, 0, width, height);
      for (const fish of jellyfish) {
        drawJellyfish(
          context,
          bell,
          fish,
          elapsed / 1000,
          width,
          height,
          PALETTE,
        );
      }
    }

    function resize() {
      cancelAnimationFrame(frame);
      lastTick = null;
      lastDraw = -FRAME_INTERVAL;
      if (!desktop.matches) {
        canvas.width = 0;
        canvas.height = 0;
        return;
      }
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.textAlign = "center";
      context.textBaseline = "middle";
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

  return <canvas ref={canvasRef} data-ui="pg-jellyfish" aria-hidden="true" />;
}
