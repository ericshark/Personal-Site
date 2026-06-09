import Reveal from "@/components/Reveal";
import { stackLine } from "@/data/portfolio";

export default function StackLine() {
  return (
    <section aria-label="Tools" className="pb-24 sm:pb-32">
      <Reveal>
        <div className="grid gap-3 border-t border-neutral-200 pt-10 sm:grid-cols-[8.5rem_1fr] sm:gap-10">
          <p
            aria-hidden="true"
            className="font-mono text-xs uppercase leading-6 tracking-[0.2em] text-neutral-400"
          >
            Tools
          </p>
          <p className="max-w-[58ch] text-pretty font-mono text-sm leading-relaxed text-neutral-500">
            {stackLine}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
