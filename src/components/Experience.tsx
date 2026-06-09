import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { earlierExperience, experience, type Experience as ExperienceEntry } from "@/data/portfolio";

function Entry({ entry }: { entry: ExperienceEntry }) {
  return (
    <article>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="font-medium tracking-tight">
          {entry.role}
          <span className="text-neutral-500"> · {entry.org}</span>
        </h3>
        <p className="shrink-0 font-mono text-xs text-neutral-500">
          {entry.period}
        </p>
      </div>

      <p
        className={`mt-2 max-w-[60ch] text-sm leading-relaxed text-neutral-600 ${
          entry.compact ? "" : "sm:text-base"
        }`}
      >
        {entry.description}
      </p>

      {entry.details && (
        <ul className="mt-4 space-y-2">
          {entry.details.map((detail) => (
            <li
              key={detail}
              className="flex gap-3 text-sm leading-relaxed text-neutral-700"
            >
              <span aria-hidden="true" className="select-none text-neutral-400">
                —
              </span>
              <span className="max-w-[58ch]">{detail}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.stack.length > 0 && (
        <p className="mt-4 font-mono text-xs text-neutral-500">
          {entry.stack.join(" · ")}
        </p>
      )}
    </article>
  );
}

export default function Experience() {
  return (
    <section aria-labelledby="experience" className="pb-24 sm:pb-32">
      <SectionHeading index="02" title="Selected Experience" id="experience" />

      <div className="mt-14 space-y-12 sm:mt-16 sm:space-y-14">
        {experience.map((entry) => (
          <Reveal key={`${entry.role}-${entry.org}`}>
            <Entry entry={entry} />
          </Reveal>
        ))}
      </div>

      {earlierExperience.length > 0 && (
        <Reveal className="mt-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
            Earlier
          </p>
          <div className="mt-5 space-y-8">
            {earlierExperience.map((entry) => (
              <Entry key={`${entry.role}-${entry.org}`} entry={entry} />
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}
