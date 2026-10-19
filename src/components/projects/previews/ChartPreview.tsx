import { type PreviewProps, series, toPoints } from "./shared";

/** Area chart that draws itself, with a dashed forecast continuing past "now". */
export default function ChartPreview({ seed }: PreviewProps) {
  const values = series(seed, 28);
  const history = values.slice(0, 20);
  const line = toPoints(history, 70, 60);
  const forecast = toPoints(values.slice(19), 30, 60)
    .split(" ")
    .map((point) => {
      const [x, y] = point.split(",").map(Number);
      return `${(x + 70).toFixed(2)},${y}`;
    })
    .join(" ");
  const area = `0,60 ${line} 70,60`;

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] text-neutral-500">
        <span>last 30 days</span>
        <span className="text-[var(--pv)]">
          ▲ {(4 + (seed % 9)).toFixed(1)}%
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        <svg
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {[15, 30, 45].map((y) => (
            <line
              key={y}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              stroke="rgb(var(--color-neutral-300))"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polygon points={area} fill="var(--pv-soft)" />
          <polyline
            points={line}
            pathLength={1}
            fill="none"
            stroke="var(--pv)"
            strokeWidth="2"
            strokeDasharray="1"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="animate-[pv-draw_6s_var(--ease-soft)_infinite]"
          />
          <polyline
            points={forecast}
            fill="none"
            stroke="var(--pv)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.6"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="70"
            x2="70"
            y1="0"
            y2="60"
            stroke="rgb(var(--color-neutral-400))"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="absolute -top-1 left-[70%] ml-1.5 font-mono text-[9px] text-neutral-500">
          now
        </span>
      </div>
    </div>
  );
}
