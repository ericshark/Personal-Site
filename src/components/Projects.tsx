import { ArrowUpRight, Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";

export default function Projects() {
  return (
    <section aria-labelledby="projects" className="pb-20 sm:pb-28">
      <SectionHeading index="01" title="Projects" id="projects" />

      <div className="mt-9 divide-y divide-neutral-300/70 sm:mt-12">
        {projects.map((project) => (
          <article
            key={project.name}
            className="py-9 first:pt-0 last:pb-0 sm:py-12"
          >
            <Reveal className="studio-grid">
              <div className="flex items-baseline justify-between gap-5 font-mono text-[11px] leading-relaxed md:block">
                <p className="max-w-[19ch] text-neutral-600">
                  {project.category}
                </p>
                <p className="shrink-0 text-neutral-500 md:mt-3">
                  {project.date}
                </p>
              </div>

              <div className="min-w-0">
                <h3 className="text-2xl font-medium leading-[1.2] tracking-[-0.025em] sm:text-[28px]">
                  {project.name}
                </h3>
                <p className="mt-3 max-w-[59ch] text-pretty text-base leading-relaxed text-neutral-600">
                  {project.description}
                </p>

                <ul className="mt-5 space-y-2 text-sm leading-relaxed text-neutral-700">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden="true" className="text-neutral-400">
                        —
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 font-mono text-[11px] leading-loose text-neutral-500">
                  <span className="sr-only">Built with: </span>
                  {project.stack.join(" · ")}
                </p>

                <div className="relative mt-5 border-t border-neutral-200 pt-2">
                  <details className="group">
                    <summary className="action-quiet w-fit max-w-[calc(100%-6rem)] cursor-pointer font-mono text-xs sm:max-w-[calc(100%-9rem)]">
                      Technical details
                      <span className="sr-only"> for {project.name}</span>
                      <Plus
                        size={14}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-200 ease-out group-open:rotate-45"
                      />
                    </summary>
                    <ul className="mt-3 space-y-4 border-t border-neutral-200 pb-2 pt-5 text-sm leading-relaxed text-neutral-600">
                      {project.details.map((detail) => (
                        <li key={detail} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400"
                          />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </details>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.name} on GitHub`}
                      className="action-quiet absolute right-0 top-2 font-mono text-xs"
                    >
                      <span>
                        <span className="hidden sm:inline">View on </span>
                        GitHub
                      </span>
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}
