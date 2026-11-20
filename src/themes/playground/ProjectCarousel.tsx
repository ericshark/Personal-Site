"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SlotProps } from "@/themes/client";
import DecodeText from "@/themes/playground/DecodeText";
import RollingText from "@/themes/playground/RollingText";

/** One project screenshot in the ring (built by Projects.tsx, a server component). */
export type CarouselItem = {
  slug: string;
  name: string;
  category: string;
  /** Screenshot base path; the `-thumb` AVIF/WebP pair is used. */
  src: string;
  alt: string;
};

const RING_SPEED = 8; // degrees per second while auto-rotating

const wrap = (value: number, count: number) =>
  ((value % count) + count) % count;
const pad = (value: number) => String(value).padStart(2, "0");

function RingCard({
  item,
  index,
  step,
  rotation,
  front,
  onSelect,
}: {
  item: CarouselItem;
  index: number;
  step: number;
  rotation: MotionValue<number>;
  front: boolean;
  onSelect: () => void;
}) {
  const facing = useTransform(rotation, (value) =>
    Math.cos(((index * step + value) * Math.PI) / 180),
  );
  const opacity = useTransform(facing, [-1, 0, 1], [0.16, 0.55, 1]);
  const image = (
    <picture>
      <source srcSet={`${item.src}-thumb.avif`} type="image/avif" />
      <img
        src={`${item.src}-thumb.webp`}
        alt=""
        width={480}
        height={300}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </picture>
  );

  return (
    <motion.div
      data-ui="pg-ring-card"
      data-front={front || undefined}
      style={{
        transform: `rotateY(${index * step}deg) translateZ(var(--ring-radius))`,
        opacity,
      }}
    >
      {front ? (
        <Link
          href={`/projects/${item.slug}`}
          aria-label={`Open ${item.name} case study`}
          draggable={false}
        >
          {image}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={`Show ${item.name}`}
          onClick={onSelect}
        >
          {image}
        </button>
      )}
    </motion.div>
  );
}

/**
 * Interaction Playground's 3D gallery carousel (src/demos/galleries.tsx), showing
 * project screenshots. It auto-rotates, slows on hover, spins with a drag and
 * snaps with a spring. A side card rotates to the front when clicked; the front
 * card opens its case study.
 */
export default function ProjectCarousel({ data }: SlotProps) {
  const items = (data as CarouselItem[] | undefined) ?? [];
  const count = items.length;
  const step = 360 / Math.max(count, 1);

  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.3 });
  const rotation = useMotionValue(0);
  const speed = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [front, setFront] = useState(0);
  const drag = useRef<{
    x: number;
    time: number;
    velocity: number;
    moved: number;
  } | null>(null);
  const settling = useRef<AnimationPlaybackControls | null>(null);
  const suppressClick = useRef(false);

  // Spins up from rest once in view; eases to a stop on hover or during a drag.
  useAnimationFrame((_, delta) => {
    if (!inView) return;
    const target = hovered || drag.current || settling.current ? 0 : 1;
    speed.current += (target - speed.current) * Math.min(1, delta / 450);
    if (!drag.current && !settling.current)
      rotation.set(
        rotation.get() - (speed.current * RING_SPEED * delta) / 1000,
      );
  });

  useMotionValueEvent(rotation, "change", (value) =>
    setFront(wrap(Math.round(-value / step), count)),
  );

  const settleTo = (target: number, velocity = 0) => {
    settling.current?.stop();
    settling.current = animate(rotation, target, {
      type: "spring",
      stiffness: 110,
      damping: 20,
      velocity,
      onComplete: () => {
        settling.current = null;
      },
    });
  };
  const goTo = (index: number) => {
    const current = -rotation.get() / step;
    const offset = wrap(index - current + count / 2, count) - count / 2;
    settleTo(-(current + offset) * step);
  };
  const advance = (by: number) => {
    const current = Math.round(-rotation.get() / step);
    settleTo(-(current + by) * step);
  };

  if (count === 0) return null;
  const item = items[front];

  return (
    <motion.section
      ref={rootRef}
      aria-label="Project gallery"
      aria-roledescription="carousel"
      data-ui="pg-carousel"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          advance(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          advance(1);
        }
      }}
    >
      <div
        data-ui="pg-ring-viewport"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          settling.current?.stop();
          settling.current = null;
          drag.current = {
            x: event.clientX,
            time: performance.now(),
            velocity: 0,
            moved: 0,
          };
        }}
        onPointerMove={(event) => {
          const state = drag.current;
          if (!state) return;
          const now = performance.now();
          const dx = event.clientX - state.x;
          if (state.moved < 6 && Math.abs(state.moved + dx) >= 6)
            event.currentTarget.setPointerCapture(event.pointerId);
          state.moved += Math.abs(dx);
          const degrees = dx * 0.32;
          rotation.set(rotation.get() + degrees);
          state.velocity = (degrees / Math.max(now - state.time, 1)) * 1000;
          state.x = event.clientX;
          state.time = now;
        }}
        onPointerUp={() => {
          const state = drag.current;
          drag.current = null;
          if (!state || state.moved < 6) return;
          suppressClick.current = true;
          window.setTimeout(() => (suppressClick.current = false), 0);
          const projected = rotation.get() + state.velocity * 0.22;
          settleTo(Math.round(projected / step) * step, state.velocity);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <div data-ui="pg-ring-tilt">
          <motion.div data-ui="pg-ring" style={{ rotateY: rotation }}>
            {items.map((entry, i) => (
              <RingCard
                key={entry.slug}
                item={entry}
                index={i}
                step={step}
                rotation={rotation}
                front={front === i}
                onSelect={() => goTo(i)}
              />
            ))}
          </motion.div>
        </div>
        <div data-ui="pg-ring-floor" aria-hidden="true" />
      </div>

      <div data-ui="pg-carousel-controls">
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => advance(-1)}
        >
          <ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
        {/* Not a live region: auto-rotation would announce every few seconds. */}
        <div data-ui="pg-carousel-caption">
          <p data-ui="pg-carousel-name">
            <DecodeText key={item.slug} text={item.name} trigger="mount" />
          </p>
          <p data-ui="pg-carousel-meta">
            <RollingText text={`${pad(front + 1)} / ${pad(count)}`} />
            <span aria-hidden="true"> · </span>
            {item.category}
          </p>
        </div>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => advance(1)}
        >
          <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </motion.section>
  );
}
