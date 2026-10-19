const spans = [
  { label: "agent.run", start: 0, width: 100, depth: 0 },
  { label: "llm.plan", start: 3, width: 24, depth: 1 },
  { label: "tool.search", start: 29, width: 16, depth: 1 },
  { label: "llm.call", start: 47, width: 21, depth: 1 },
  { label: "tool.fetch", start: 50, width: 11, depth: 2, error: true },
  { label: "llm.answer", start: 70, width: 27, depth: 1 },
];

/** Span waterfall with a playhead sweeping across it. */
export default function TracePreview() {
  return (
    <div className="flex h-full flex-col gap-3 p-4 font-mono text-[10px] text-neutral-500">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate">trace_8f2c1a</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-[pv-pulse_1.6s_ease-in-out_infinite] rounded-full bg-[var(--pv)]" />
          live · 2.41s
        </span>
      </div>
      <div className="relative flex flex-1 flex-col justify-evenly gap-1.5">
        {spans.map((span, i) => (
          <div
            key={span.label + i}
            className="grid grid-cols-[32%_1fr] items-center gap-2"
          >
            <span
              className="truncate"
              style={{ paddingLeft: `${span.depth * 8}px` }}
            >
              {span.label}
            </span>
            <span className="relative h-2.5">
              <span
                className={`absolute inset-y-0 origin-left animate-[pv-grow_900ms_var(--ease-soft)_both] rounded-sm ${
                  span.error ? "bg-red-500/80" : "bg-[var(--pv)]"
                }`}
                style={{
                  left: `${span.start}%`,
                  width: `${span.width}%`,
                  opacity: span.depth === 0 ? 0.35 : 0.9,
                  animationDelay: `${i * 90}ms`,
                }}
              />
            </span>
          </div>
        ))}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-[calc(32%+0.5rem)] right-0"
        >
          <span className="absolute inset-y-0 w-px animate-[pv-scan_3.2s_linear_infinite] bg-ink/40" />
        </span>
      </div>
    </div>
  );
}
