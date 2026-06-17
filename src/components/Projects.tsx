import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";

export default function Projects() {
  return (
    <section aria-labelledby="projects" className="pb-24 sm:pb-32">
      <SectionHeading index="01" title="Projects" id="projects" />

      <div className="mt-8 space-y-10 sm:space-y-14">
        {projects.map((project) => (
          <Reveal key={project.name}>
            <article className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="decoration-neutral-400 underline-offset-4 hover:underline"
                    >
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>
                <time className="font-mono text-xs text-neutral-400">
                  {project.date}
                </time>
              </div>

              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Built with">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md bg-neutral-200/70 px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium text-neutral-600"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <p className="mt-5 max-w-[62ch] text-pretty text-[0.9375rem] leading-relaxed text-neutral-600">
                {project.description}
              </p>

              <ul className="mt-6 space-y-3 border-t border-neutral-200 pt-5">
                {project.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex gap-3 text-[0.875rem] leading-relaxed text-neutral-700"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300"
                    />
                    <span className="max-w-[58ch]">{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
