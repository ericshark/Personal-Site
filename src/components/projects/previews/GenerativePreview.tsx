import type { PreviewProps } from "./shared";

type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
};

const maxDepth = 7;

/** Grows a deterministic branching plant, in the spirit of an L-system. */
function grow(seed: number) {
  const segments: Segment[] = [];

  function branch(
    x: number,
    y: number,
    angle: number,
    length: number,
    depth: number,
  ) {
    if (depth === 0) return;
    const x2 = x + Math.cos(angle) * length;
    const y2 = y - Math.sin(angle) * length;
    // Round so server and client render identical attributes.
    segments.push({
      x1: +x.toFixed(2),
      y1: +y.toFixed(2),
      x2: +x2.toFixed(2),
      y2: +y2.toFixed(2),
      depth,
    });
    const spread = 0.32 + ((seed * (depth + 3)) % 7) / 35;
    branch(x2, y2, angle + spread, length * 0.76, depth - 1);
    branch(x2, y2, angle - spread * 0.85, length * 0.7, depth - 1);
  }

  branch(50, 98, Math.PI / 2, 21, maxDepth);
  return segments;
}

export default function GenerativePreview({ seed }: PreviewProps) {
  const segments = grow(seed);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full p-3"
      aria-hidden="true"
    >
      {segments.map((segment, i) => (
        <line
          key={i}
          {...segment}
          pathLength={1}
          stroke={
            segment.depth > 4 ? "rgb(var(--color-neutral-500))" : "var(--pv)"
          }
          strokeWidth={segment.depth * 0.32}
          strokeLinecap="round"
          strokeDasharray="1"
          className="animate-[pv-draw_8s_ease-out_infinite_both]"
          style={{ animationDelay: `${(maxDepth - segment.depth) * 0.28}s` }}
        />
      ))}
      {segments
        .filter((segment) => segment.depth === 1)
        .map((segment, i) => (
          <circle
            key={i}
            cx={segment.x2}
            cy={segment.y2}
            r={i % 3 === 0 ? 1.6 : 1}
            fill="var(--pv)"
            className="animate-[pv-pulse_2.4s_ease-in-out_infinite]"
            style={{
              animationDelay: `${(i % 7) * 0.2}s`,
              transformOrigin: `${segment.x2}px ${segment.y2}px`,
              transformBox: "view-box",
            }}
          />
        ))}
    </svg>
  );
}
