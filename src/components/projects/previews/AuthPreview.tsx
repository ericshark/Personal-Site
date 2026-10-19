/** Sign-in card with a two-factor code being typed and a token floating beside it. */
export default function AuthPreview() {
  return (
    <div className="flex h-full items-center justify-center px-4 py-2">
      <div className="relative w-full max-w-[13rem] animate-[pv-float_5s_ease-in-out_infinite] rounded-xl border border-neutral-200 bg-paper p-3 shadow-[0_12px_30px_-18px_var(--pv)]">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--pv-soft)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--pv)]" />
          </span>
          <span className="h-2 w-16 rounded-full bg-neutral-300" />
        </div>
        <span className="mt-3 flex h-6 items-center rounded-md border border-neutral-200 bg-neutral-100/60 px-2 font-mono text-[10px] tracking-[0.3em] text-neutral-500">
          ••••••••
        </span>
        <div className="mt-2 grid grid-cols-6 gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="grid h-6 place-items-center rounded border border-neutral-200 font-mono text-[10px] text-ink"
            >
              <span
                className="animate-[pv-type_4s_steps(1)_infinite]"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                {"482915"[i]}
              </span>
            </span>
          ))}
        </div>
        <span className="mt-2 block h-5 rounded-md bg-[var(--pv)]" />
        <span className="absolute -right-3 -top-3 rounded-full border border-neutral-200 bg-paper px-2 py-0.5 font-mono text-[9px] text-[var(--pv)] shadow-sm">
          JWT ✓
        </span>
      </div>
    </div>
  );
}
