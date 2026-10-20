import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { education } from "@/data/portfolio";

export default function Education() {
  return (
    <section aria-labelledby="education" className="pb-24 sm:pb-32">
      <SectionHeading index="03" title="Education" id="education" />

      <Reveal className="mt-12 sm:mt-14">
        <article className="grid gap-3 sm:grid-cols-[8.5rem_1fr] sm:gap-10">
          <p className="font-mono text-xs leading-6 text-neutral-500">
            {education.graduated}
          </p>

          <div className="min-w-0">
            <h3 className="text-lg font-medium leading-snug tracking-tight">
              {education.degree}
            </h3>
            <p className="mt-1.5 font-mono text-xs text-neutral-500">
              {education.school} · {education.location}
            </p>
            <p className="mt-3.5 font-mono text-xs text-neutral-500">
              GPA {education.gpa}
            </p>
            <p className="mt-5 max-w-[58ch] text-pretty text-sm leading-relaxed text-neutral-600">
              <span className="text-neutral-500">Relevant coursework: </span>
              {education.coursework.join(", ")}
            </p>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
