/**
 * Designed visuals for projects without a usable UI screenshot (Agent Tracer's
 * demo sits behind a login; AuthCore has no UI). Drawn from the site's colour
 * tokens so they follow the light/dark theme.
 */

type Span = {
  name: string;
  kind: "agent" | "llm" | "tool";
  depth: number;
  start: number;
  end: number;
  error?: boolean;
};

const spans: Span[] = [
  { name: "research-agent", kind: "agent", depth: 0, start: 0, end: 100 },
  { name: "plan · claude", kind: "llm", depth: 1, start: 1, end: 27 },
  { name: "search_docs", kind: "tool", depth: 1, start: 28, end: 46 },
  { name: "fetch_page", kind: "tool", depth: 2, start: 30, end: 44 },
  {
    name: "query_metrics",
    kind: "tool",
    depth: 1,
    start: 47,
    end: 58,
    error: true,
  },
  { name: "retry · claude", kind: "llm", depth: 1, start: 59, end: 82 },
  { name: "summarize · claude", kind: "llm", depth: 1, start: 83, end: 99 },
];

const barColor: Record<Span["kind"], string> = {
  agent: "bg-ink/80",
  llm: "bg-accent/70",
  tool: "bg-neutral-400",
};

const frame =
  "flex h-full w-full flex-col justify-center bg-neutral-100 font-mono text-neutral-600";

/** A waterfall trace like Agent Tracer's timeline view. */
function TraceVisual({ compact }: { compact: boolean }) {
  return (
    <div
      className={`${frame} ${compact ? "p-[8%] text-[8px]" : "p-[6%] text-[10px] sm:text-[11px]"}`}
    >
      {!compact && (
        <div className="mb-3 flex justify-between gap-4 border-b border-neutral-300 pb-2 text-neutral-500">
          <span>trace 7f3a·e21c</span>
          <span>4.82s · 1,904 tok · $0.014</span>
        </div>
      )}
      <ul className={compact ? "space-y-1" : "space-y-2"}>
        {spans.map((s) => (
          <li
            key={s.name}
            className={`grid items-center gap-3 ${compact ? "grid-cols-1" : "grid-cols-[minmax(0,9.5rem)_1fr]"}`}
          >
            {!compact && (
              <span
                className={`truncate ${s.error ? "text-red-600 dark:text-red-400" : ""}`}
                style={{ paddingLeft: `${s.depth * 0.75}rem` }}
              >
                {s.error ? "✕ " : ""}
                {s.name}
              </span>
            )}
            <span
              className={`relative rounded-sm bg-neutral-200/70 ${compact ? "h-1.5" : "h-2.5"}`}
            >
              <span
                className={`absolute inset-y-0 rounded-sm ${
                  s.error ? "bg-red-500/70" : barColor[s.kind]
                }`}
                style={{ left: `${s.start}%`, width: `${s.end - s.start}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      {!compact && (
        <div className="mt-3 flex gap-4 text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-accent/70" />
            llm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-neutral-400" />
            tool
          </span>
          <span className="ml-auto">● live</span>
        </div>
      )}
    </div>
  );
}

const authSteps: { req: string; res: string; tone: "ok" | "bad" | "note" }[] = [
  { req: "POST /login", res: "200 · token₁", tone: "ok" },
  { req: "POST /refresh token₁", res: "200 · token₂", tone: "ok" },
  { req: "POST /refresh token₁", res: "401 · reuse detected", tone: "bad" },
  { req: "", res: "token family revoked", tone: "note" },
];

/** A request/response sequence showing AuthCore's refresh-token rotation. */
function AuthVisual({ compact }: { compact: boolean }) {
  const tone = (t: "ok" | "bad" | "note") =>
    t === "bad"
      ? "text-red-600 dark:text-red-400"
      : t === "note"
        ? "text-accent"
        : "";

  if (compact) {
    return (
      <div className={`${frame} p-[8%] text-[8px] leading-tight`}>
        <ol className="space-y-1.5">
          {authSteps.map((step, i) => (
            <li key={i} className="truncate">
              <span className="text-ink">{step.req || "↳"}</span>{" "}
              <span className={tone(step.tone)}>
                {step.tone === "note" ? "" : "→ "}
                {step.res}
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className={`${frame} p-[6%] text-[10px] sm:text-[11px]`}>
      <div className="mb-3 flex justify-between gap-4 border-b border-neutral-300 pb-2 text-neutral-500">
        <span>refresh-token rotation</span>
        <span>JWT strategy</span>
      </div>
      <ol className="space-y-2.5">
        {authSteps.map((step, i) => (
          <li
            key={i}
            className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[1.25rem_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <span className="text-neutral-400">
              {step.req ? `0${i + 1}` : ""}
            </span>
            <span className="truncate text-ink">{step.req}</span>
            <span
              className={`col-start-2 truncate sm:col-start-3 ${tone(step.tone)}`}
            >
              {step.tone === "note" ? "↳ " : "→ "}
              {step.res}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-300 pt-2 text-neutral-500">
        <span>Argon2</span>
        <span>Redis lockout</span>
        <span>TOTP 2FA</span>
        <span>OAuth2</span>
      </div>
    </div>
  );
}

const descriptions = {
  trace:
    "Illustration of a trace waterfall: a research agent runs nested model and tool calls as timed bars. One tool call fails, and a retried model call follows.",
  auth: "Illustration of refresh-token rotation: login returns a token, a refresh returns a new one, and replaying the old token is rejected with 401 and revokes the token family.",
};

export default function ProjectVisual({
  type,
  compact = false,
}: {
  type: "trace" | "auth";
  compact?: boolean;
}) {
  return (
    <div role="img" aria-label={descriptions[type]} className="h-full w-full">
      {type === "trace" ? (
        <TraceVisual compact={compact} />
      ) : (
        <AuthVisual compact={compact} />
      )}
    </div>
  );
}
