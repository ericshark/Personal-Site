import type { PreviewProps } from "./shared";

const orbits = [
  { radius: 20, size: 3, duration: 7 },
  { radius: 36, size: 4.5, duration: 13 },
  { radius: 52, size: 3.5, duration: 21 },
];

/** A tiny solar system with a probe's slingshot path drawing itself in. */
export default function OrbitPreview({ seed }: PreviewProps) {
  const stars = Array.from({ length: 28 }, (_, i) => ({
    x: (seed * 37 + i * 71) % 200,
    y: (seed * 13 + i * 43) % 120,
    r: i % 5 === 0 ? 0.9 : 0.5,
  }));

  return (
    <svg
      viewBox="0 0 200 120"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="rgb(var(--color-neutral-400))"
        />
      ))}
      {orbits.map((orbit) => (
        <circle
          key={orbit.radius}
          cx="100"
          cy="60"
          r={orbit.radius}
          fill="none"
          stroke="rgb(var(--color-neutral-300))"
          strokeDasharray="1.5 2.5"
        />
      ))}
      <circle cx="100" cy="60" r="12" fill="var(--pv-soft)" />
      <circle cx="100" cy="60" r="6.5" fill="var(--pv)" />
      {orbits.map((orbit, i) => (
        <g
          key={orbit.radius}
          className="animate-[pv-spin_linear_infinite]"
          style={{
            animationDuration: `${orbit.duration}s`,
            animationDelay: `${-i * 2.3}s`,
            transformOrigin: "100px 60px",
            transformBox: "view-box",
          }}
        >
          <circle
            cx={100 + orbit.radius}
            cy="60"
            r={orbit.size}
            fill={i === 1 ? "var(--pv)" : "rgb(var(--color-neutral-500))"}
          />
        </g>
      ))}
      <path
        d="M8 108 C 50 96, 70 18, 112 22 S 168 70, 194 14"
        pathLength={1}
        fill="none"
        stroke="var(--pv)"
        strokeWidth="1.2"
        strokeDasharray="1"
        strokeLinecap="round"
        className="animate-[pv-draw_5s_var(--ease-soft)_infinite]"
      />
      <circle
        cx="194"
        cy="14"
        r="4"
        fill="none"
        stroke="var(--pv)"
        strokeWidth="1"
        className="animate-[pv-pulse_1.6s_ease-in-out_infinite]"
        style={{ transformOrigin: "194px 14px", transformBox: "view-box" }}
      />
    </svg>
  );
}
