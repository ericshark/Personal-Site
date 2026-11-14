import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ProjectMedia from "@/components/ProjectMedia";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/portfolio";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const actionClass = "action-quiet min-h-10 font-mono text-xs md:min-h-7";

/**
 * Compact ledger: one ruled row per project with an inline thumbnail. The three
 * actions are the only links in a row, so keyboard order is Live → GitHub → Case study.
 */
export default function Projects() {
  return (
    <section aria-labelledby="projects" className="pb-14 sm:pb-20">
      <SectionHeading index="01" title="Projects" id="projects" />

      <ul
        aria-label="Projects"
        className="mt-6 divide-y divide-neutral-300/70 sm:mt-8"
      >
        {projects.map((project, index) => (
          <li key={project.slug} className="py-3 first:pt-0 last:pb-0">
            <Reveal
              delay={Math.min(index, 3) * 0.04}
              className="studio-grid max-md:grid-cols-[6.5rem_minmax(0,1fr)] max-md:gap-x-4 max-md:gap-y-2 md:gap-x-6 md:gap-y-0"
            >
              <div className="aspect-[16/10] self-start overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 md:row-span-2">
                <ProjectMedia project={project} variant="thumb" />
              </div>

              <div className="min-w-0 md:col-start-2 md:flex md:items-baseline md:justify-between md:gap-6">
                <div className="min-w-0">
                  <h3 className="text-base font-medium leading-snug tracking-[-0.02em] sm:text-lg">
                    {project.name}
                  </h3>
                  <p className="mt-1 max-w-[56ch] text-pretty text-sm leading-snug text-neutral-600">
                    {project.oneLiner}
                  </p>
                </div>
                <p className="mt-2 hidden shrink-0 whitespace-nowrap font-mono text-[11px] text-neutral-500 md:block">
                  {project.category} · {project.year}
                </p>
              </div>

              <div className="min-w-0 max-md:col-span-2 md:col-start-2">
                <p className="font-mono text-[11px] leading-relaxed text-neutral-500 md:mt-1">
                  <span className="sr-only">Built with: </span>
                  {project.stack.join(" · ")}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-neutral-500 md:hidden">
                  {project.category} · {project.year}
                </p>

                <div className="-ml-2 mt-1 flex flex-wrap items-center gap-x-1 md:mt-0.5">
                  {project.live && (
                    <a
                      href={project.live}
                      {...external}
                      aria-label={`${project.name} live site`}
                      className={actionClass}
                    >
                      Live
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      {...external}
                      aria-label={`${project.name} on GitHub`}
                      className={actionClass}
                    >
                      GitHub
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`${project.name} case study`}
                    className="link-arrow mx-0 min-h-10 px-2 md:min-h-7"
                  >
                    <span>Case study</span>
                    <ArrowRight
                      size={13}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
