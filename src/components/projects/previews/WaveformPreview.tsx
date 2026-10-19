const hosts = [
  { name: "nyc", ms: 18 },
  { name: "fra", ms: 92 },
  { name: "sin", ms: 214 },
];

// One period spans 200 units and the path is drawn twice as wide, so sliding
// it left by half loops seamlessly.
function wavePath(cycles: number, amplitude: number) {
  const points: string[] = [];
  for (let x = 0; x <= 400; x += 4) {
    const t = (x / 200) * Math.PI * 2;
    const y =
      30 +
      amplitude * Math.sin(t * cycles) +
      amplitude * 0.4 * Math.sin(t * cycles * 3);
    points.push(`${x},${y.toFixed(2)}`);
  }
  return `M${points.join(" L")}`;
}

/** Ping times as sound: per-host chips over scrolling waveforms. */
export default function WaveformPreview() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
        {hosts.map((host, i) => (
          <span
            key={host.name}
            className={`rounded-full border px-2 py-0.5 ${
              i === 0
                ? "border-transparent bg-[var(--pv-soft)] text-[var(--pv)]"
                : "border-neutral-200 text-neutral-500"
            }`}
          >
            {host.name} {host.ms}ms
          </span>
        ))}
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-[200%] animate-[pv-marquee_4s_linear_infinite]"
          aria-hidden="true"
        >
          <path
            d={wavePath(3, 14)}
            fill="none"
            stroke="var(--pv)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            transform="scale(0.5 1)"
          />
          <path
            d={wavePath(5, 7)}
            fill="none"
            stroke="rgb(var(--color-neutral-400))"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            transform="scale(0.5 1)"
          />
        </svg>
      </div>
      <div className="flex h-6 items-end gap-[2px]">
        {Array.from({ length: 32 }, (_, i) => (
          <span
            key={i}
            className="flex-1 origin-bottom animate-[pv-bar_0.9s_ease-in-out_infinite_alternate] rounded-t-[1px] bg-[var(--pv-soft)]"
            style={{
              height: `${30 + ((i * 37) % 70)}%`,
              animationDelay: `${-(i % 9) * 0.11}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
