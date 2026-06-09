import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";

export default function Projects() {
  return (
    <section aria-labelledby="projects" className="pb-24 sm:pb-32">
      <SectionHeading index="01" title="Projects" id="projects" />

      <div className="mt-4">
        {projects.map((project) => (
          <Reveal
            key={project.name}
            className="border-t border-neutral-200 py-12 first:border-t-0 sm:py-16 first:sm:pt-12"
          >
            <article className="grid gap-5 sm:grid-cols-[8.5rem_1fr] sm:gap-10">
              {/* Left rail: date */}
              <p className="font-mono text-xs leading-6 text-neutral-500">
                {project.date}
              </p>

              {/* Right column: content */}
              <div>
                <h3 className="text-balance text-2xl font-medium leading-snug tracking-tight">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="decoration-black underline-offset-4 hover:underline"
                    >
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>

                <p className="mt-4 max-w-[58ch] text-pretty leading-relaxed text-neutral-600">
                  {project.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {project.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-3.5 text-[0.9375rem] leading-relaxed text-neutral-700"
                    >
                      <span
                        aria-hidden="true"
                        className="select-none text-neutral-300"
                      >
                        —
                      </span>
                      <span className="max-w-[54ch]">{detail}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Built with">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-neutral-200 px-3 py-1 font-mono text-[0.6875rem] text-neutral-600"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
