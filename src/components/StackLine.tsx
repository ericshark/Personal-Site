import Reveal from "@/components/Reveal";
import { stackLine } from "@/data/portfolio";

export default function StackLine() {
  return (
    <section aria-label="Tools" className="pb-24 sm:pb-32">
      <Reveal>
        <div className="border-t border-neutral-200 pt-10">
          <p className="max-w-[58ch] font-mono text-sm leading-relaxed text-neutral-500">
            {stackLine}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
