import { type PreviewProps, series, toPoints } from "./shared";

const tiles = [
  { label: "uptime", value: "99.98%" },
  { label: "p95", value: "142ms" },
  { label: "req/s", value: "3.2k" },
];

/** KPI tiles over a breathing bar chart and a sparkline. */
export default function DashboardPreview({ seed }: PreviewProps) {
  const bars = series(seed, 18);
  const spark = toPoints(series(seed + 7, 24), 100, 30);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((tile, i) => (
          <div
            key={tile.label}
            className="min-w-0 rounded-lg border border-neutral-200 bg-paper px-2.5 py-2"
          >
            <p className="truncate font-mono text-[9px] uppercase tracking-wider text-neutral-500">
              {tile.label}
            </p>
            <p
              className={`truncate text-sm font-medium tracking-tight ${
                i === 0 ? "text-[var(--pv)]" : ""
              }`}
            >
              {tile.value}
            </p>
          </div>
        ))}
      </div>
      <div className="relative flex min-h-0 flex-1 items-end gap-[3%] rounded-lg border border-neutral-200 bg-paper p-3">
        {bars.map((value, i) => (
          <span
            key={i}
            className={`flex-1 origin-bottom animate-[pv-bar_1.8s_ease-in-out_infinite_alternate] rounded-t-sm ${
              i === 12 ? "bg-[var(--pv)]" : "bg-[var(--pv-soft)]"
            }`}
            style={{
              height: `${25 + value * 70}%`,
              animationDelay: `${-i * 0.17}s`,
            }}
          />
        ))}
        <svg
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-3 top-3 h-1/3 w-[calc(100%-1.5rem)] overflow-visible"
          aria-hidden="true"
        >
          <polyline
            points={spark}
            fill="none"
            stroke="var(--pv)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
