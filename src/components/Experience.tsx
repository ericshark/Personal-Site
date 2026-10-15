import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import {
  earlierExperience,
  experience,
  type Experience as ExperienceEntry,
} from "@/data/portfolio";

function Entry({ entry }: { entry: ExperienceEntry }) {
  return (
    <Reveal className="studio-grid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 font-mono text-[11px] leading-relaxed text-neutral-500 md:block">
        <p>{entry.period}</p>
        <p className="md:mt-2">{entry.location}</p>
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-medium leading-snug tracking-tight sm:text-xl">
          {entry.org}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
          {entry.role}
        </p>

        <p className="mt-4 max-w-[62ch] text-pretty text-[15px] leading-[1.75] text-neutral-600">
          {entry.description}
        </p>

        {entry.details && (
          <ul className="mt-5 space-y-3 text-sm leading-[1.75] text-neutral-600">
            {entry.details.map((detail) => (
              <li key={detail} className="flex gap-3">
                <span aria-hidden="true" className="text-neutral-400">
                  —
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {entry.stack.length > 0 && !entry.compact && (
          <p className="mt-5 font-mono text-[11px] leading-loose text-neutral-500">
            <span className="sr-only">Technologies: </span>
            {entry.stack.join(" · ")}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export default function Experience() {
  return (
    <section aria-labelledby="experience" className="pb-20 sm:pb-28">
      <SectionHeading index="03" title="Selected Experience" id="experience" />

      <div className="mt-9 divide-y divide-neutral-200 sm:mt-12">
        {experience.map((entry) => (
          <article
            key={`${entry.role}-${entry.org}`}
            className={`${entry.compact ? "py-8" : "py-10 sm:py-12"} first:pt-0 last:pb-0`}
          >
            <Entry entry={entry} />
          </article>
        ))}
      </div>

      {earlierExperience.length > 0 && (
        <div className="mt-10 border-t border-neutral-200 pt-8 sm:mt-12">
          <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
            Earlier
          </p>
          <div className="space-y-8">
            {earlierExperience.map((entry) => (
              <article key={`${entry.role}-${entry.org}`}>
                <Entry entry={entry} />
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
