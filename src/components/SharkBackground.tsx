"use client";

import { useEffect, useRef } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";
const FRAME_INTERVAL = 1000 / 30;
const CHARACTERS = "0123456789:=+*#";

const sharks = [
  { phase: -0.65, period: 58, depth: 0.3, scale: 1.12 },
  { phase: 2.5, period: 71, depth: 0.61, scale: 0.92 },
  { phase: 4.15, period: 83, depth: 0.51, scale: 1.28 },
];

type Shark = (typeof sharks)[number];
type Glyph = { x: number; y: number; character: string; shade: number };

// Sample the silhouette once, then bend its character grid as the tail swims.
function createSharkGlyphs(context: CanvasRenderingContext2D): Glyph[] {
  const silhouette = new Path2D(
    "M 132 0 Q 109 -16 74 -21 Q 42 -27 19 -22 " +
      "L -32 -78 Q -40 -81 -32 -64 L -10 -22 " +
      "Q -42 -14 -80 -7 L -109 -5 " +
      "Q -121 -24 -143 -38 Q -146 -20 -127 0 " +
      "Q -146 20 -143 38 Q -121 24 -109 5 " +
      "L -80 7 Q -42 14 -10 22 " +
      "L -32 64 Q -40 81 -32 78 L 19 22 " +
      "Q 42 27 74 21 Q 109 16 132 0 Z",
  );
  const glyphs: Glyph[] = [];

  for (let y = -80; y <= 80; y += 5) {
    for (let x = -148; x <= 132; x += 4) {
      if (!context.isPointInPath(silhouette, x, y)) continue;
      const grain = Math.abs(Math.sin(x * 12.9898 + y * 78.233));
      const spine = Math.exp(-Math.abs(y) / 12);
      glyphs.push({
        x,
        y,
        character: CHARACTERS[Math.floor(grain * CHARACTERS.length)],
        shade: Math.min(3, Math.floor(grain * 2 + spine * 1.8)),
      });
    }
  }

  return glyphs;
}

function swimmingPose(
  shark: Shark,
  time: number,
  width: number,
  height: number,
) {
  const angle = (time / shark.period) * Math.PI * 2 + shark.phase;
  // The turns happen outside the viewport, including the shark's whole tail.
  const horizontalRadius = width / 2 + 320;
  const verticalWave = angle * 2 + shark.phase;
  return {
    x: width / 2 + Math.sin(angle) * horizontalRadius,
    y: height * (shark.depth + Math.sin(verticalWave) * 0.22),
    heading: Math.atan2(
      height * 0.44 * Math.cos(verticalWave),
      horizontalRadius * Math.cos(angle),
    ),
  };
}

function drawShark(
  context: CanvasRenderingContext2D,
  glyphs: Glyph[],
  shark: Shark,
  time: number,
  width: number,
  height: number,
  palette: string[],
) {
  context.font = `${6 * shark.scale}px monospace`;
  context.fillStyle = palette[1];

  // Sample earlier positions so trails follow the same curved path as the fish.
  for (let step = 1; step <= 32; step++) {
    const age = step * 0.12;
    const previous = swimmingPose(shark, time - age, width, height);
    const cosine = Math.cos(previous.heading);
    const sine = Math.sin(previous.heading);
    const tailX = previous.x - cosine * 135 * shark.scale;
    const tailY = previous.y - sine * 135 * shark.scale;
    context.globalAlpha = (1 - step / 33) * 0.24;

    for (let lane = -2; lane <= 2; lane++) {
      const spread =
        lane * (5 + age * 11) + Math.sin(step * 1.7 + lane + time) * age * 4;
      context.fillText(
        step % 3 === 0 ? ":" : ".",
        tailX - sine * spread,
        tailY + cosine * spread,
      );
    }
  }

  const pose = swimmingPose(shark, time, width, height);
  const cosine = Math.cos(pose.heading);
  const sine = Math.sin(pose.heading);
  context.globalAlpha = 0.72;

  for (const glyph of glyphs) {
    const tailWeight = (132 - glyph.x) / 280;
    const bend =
      Math.sin(tailWeight * 5 - time * 3.6 + shark.phase) *
      tailWeight ** 2 *
      21;
    const x = glyph.x * shark.scale;
    const y = (glyph.y + bend) * shark.scale;
    context.fillStyle = palette[glyph.shade];
    context.fillText(
      glyph.character,
      pose.x + x * cosine - y * sine,
      pose.y + x * sine + y * cosine,
    );
  }

  context.globalAlpha = 1;
}

export default function SharkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvasRef.current;
    const drawingContext = element?.getContext("2d");
    if (!element || !drawingContext) return;

    const canvas = element;
    const context = drawingContext;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const glyphs = createSharkGlyphs(context);
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = -FRAME_INTERVAL;
    let palette: string[] = [];
    const startedAt = performance.now();

    function updatePalette() {
      palette = document.documentElement.classList.contains("dark")
        ? ["#69767d", "#859398", "#adb1a2", "#cad0cd"]
        : ["#a4aba9", "#798786", "#7f8170", "#4e5c60"];
    }

    function render(timestamp: number) {
      // These guards also handle a queued callback after the viewport changes.
      if (!desktop.matches || document.hidden) return;
      frame = requestAnimationFrame(render);
      const elapsed = timestamp - lastFrame;
      if (elapsed < FRAME_INTERVAL) return;
      lastFrame = timestamp - (elapsed % FRAME_INTERVAL);

      context.clearRect(0, 0, width, height);
      const time = (timestamp - startedAt) / 1000;
      for (const shark of sharks) {
        drawShark(context, glyphs, shark, time, width, height, palette);
      }
    }

    function resize() {
      cancelAnimationFrame(frame);
      if (!desktop.matches) {
        // Release the desktop backing store rather than keeping it on phones.
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
      lastFrame = -FRAME_INTERVAL;
      if (!document.hidden) frame = requestAnimationFrame(render);
    }

    updatePalette();
    resize();
    const themeObserver = new MutationObserver(updatePalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("resize", resize);
    desktop.addEventListener("change", resize);
    document.addEventListener("visibilitychange", resize);

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      desktop.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="shark-background" />
  );
}
