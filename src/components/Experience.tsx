import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import {
  earlierExperience,
  experience,
  type Experience as ExperienceEntry,
} from "@/data/portfolio";

function Entry({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className="grid gap-3 sm:grid-cols-[8.5rem_1fr] sm:gap-10">
      {/* Left rail: period */}
      <p className="font-mono text-xs leading-6 text-neutral-500">
        {entry.period}
      </p>

      {/* Right column: content */}
      <div>
        <h3 className="text-lg font-medium leading-snug tracking-tight">
          {entry.role}
        </h3>
        <p className="mt-1.5 font-mono text-xs text-neutral-500">
          {entry.org} · {entry.location}
        </p>

        <p className="mt-3.5 max-w-[58ch] text-pretty text-[0.9375rem] leading-relaxed text-neutral-600">
          {entry.description}
        </p>

        {entry.details && (
          <ul className="mt-5 space-y-2.5">
            {entry.details.map((detail) => (
              <li
                key={detail}
                className="flex gap-3.5 text-[0.9375rem] leading-relaxed text-neutral-700"
              >
                <span aria-hidden="true" className="select-none text-neutral-300">
                  —
                </span>
                <span className="max-w-[54ch]">{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {entry.stack.length > 0 && !entry.compact && (
          <p className="mt-5 font-mono text-xs text-neutral-500">
            {entry.stack.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}

export default function Experience() {
  return (
    <section aria-labelledby="experience" className="pb-24 sm:pb-32">
      <SectionHeading index="02" title="Selected Experience" id="experience" />

      <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14">
        {experience.map((entry) => (
          <Reveal key={`${entry.role}-${entry.org}`}>
            <Entry entry={entry} />
          </Reveal>
        ))}
      </div>

      {earlierExperience.length > 0 && (
        <Reveal className="mt-16 sm:mt-20">
          <div className="grid gap-3 sm:grid-cols-[8.5rem_1fr] sm:gap-10">
            <p className="font-mono text-xs uppercase leading-6 tracking-[0.2em] text-neutral-400">
              Earlier
            </p>
            <div className="space-y-8">
              {earlierExperience.map((entry) => (
                <article key={`${entry.role}-${entry.org}`}>
                  <h3 className="text-[0.9375rem] font-medium leading-snug tracking-tight">
                    {entry.role}
                    <span className="font-normal text-neutral-500">
                      {" "}
                      · {entry.org}
                    </span>
                  </h3>
                  <p className="mt-1.5 font-mono text-xs text-neutral-500">
                    {entry.period} · {entry.location}
                  </p>
                  <p className="mt-3 max-w-[58ch] text-pretty text-sm leading-relaxed text-neutral-600">
                    {entry.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
