import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";

export default function Projects() {
  return (
    <section aria-labelledby="projects" className="pb-24 sm:pb-32">
      <SectionHeading index="01" title="Projects" id="projects" />

      <div className="mt-14 space-y-16 sm:mt-16 sm:space-y-20">
        {projects.map((project) => (
          <Reveal key={project.name}>
            <article className="group">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="text-xl font-medium tracking-tight transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                  {project.name}
                </h3>
                <p className="shrink-0 font-mono text-xs text-neutral-500">
                  {project.date}
                </p>
              </div>

              <p className="mt-4 max-w-[60ch] leading-relaxed text-neutral-600">
                {project.description}
              </p>

              <ul className="mt-6 space-y-2.5">
                {project.details.map((detail) => (
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

              <p className="mt-6 font-mono text-xs text-neutral-500">
                {project.stack.join(" · ")}
              </p>

              {project.url ? (
                <p className="mt-3 font-mono text-xs">
                  <a
                    className="link-quiet"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project ↗
                  </a>
                </p>
              ) : (
                <p className="mt-3 font-mono text-xs italic text-neutral-400">
                  Case study coming soon
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
