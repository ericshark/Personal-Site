const lines = [
  { text: "$ queuewatch --env prod", tone: "text-neutral-400" },
  { text: "default   ▇▇▇▇▇▇▇░░  142 running", tone: "" },
  { text: "emails    ▇▇░░░░░░░   12 queued", tone: "" },
  { text: "reports   ✕ 3 failing · retry 4/5", tone: "text-[var(--pv)]" },
  { text: "billing   ▇▇▇▇░░░░░   38 running", tone: "" },
];

/** A terminal UI whose lines type themselves in, then clear and repeat. */
export default function TerminalPreview() {
  return (
    <div className="flex h-full flex-col p-3">
      {/* Terminals stay dark in both themes. */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-[rgb(17_17_19)] font-mono text-[10px] leading-relaxed text-[rgb(214_214_219)] shadow-inner sm:text-[11px]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-2">
          {lines.map((line, i) => (
            <span
              key={line.text}
              className={`block animate-[pv-type_7s_ease-out_infinite] whitespace-pre ${line.tone}`}
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              {line.text}
            </span>
          ))}
          <span className="block">
            {"> "}
            <span className="inline-block h-3 w-1.5 translate-y-0.5 animate-[pv-blink_1s_steps(1)_infinite] bg-[var(--pv)]" />
          </span>
        </div>
      </div>
    </div>
  );
}
