import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ProjectMedia, { MEDIA_SIZES } from "@/components/ProjectMedia";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projectKinds, projects } from "@/data/portfolio";
import { ThemeLabel, ThemeSlot, ThemeText } from "@/themes/client";
import type { CarouselItem } from "@/themes/playground/ProjectCarousel";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const actionClass =
  "peer link-arrow project-link mx-0 min-h-10 px-2 md:min-h-7";

function formatPreviewUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function ActionPreview({
  url,
  previewBase,
}: {
  url: string;
  previewBase: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-link-preview
      data-ui="link-preview"
      className="pointer-events-none invisible absolute bottom-full left-2 z-30 mb-2 w-60 origin-bottom translate-y-1.5 scale-95 rounded-lg border border-neutral-200/90 bg-surface p-2 text-ink opacity-0 shadow-lg shadow-black/10 transition-[opacity,transform,visibility] duration-200 ease-[var(--ease-soft)] peer-hover:visible peer-hover:translate-y-0 peer-hover:scale-100 peer-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:translate-y-0 peer-focus-visible:scale-100 sm:left-0 sm:w-64"
    >
      <div className="mb-1.5 px-0.5 font-mono text-[10px] leading-tight">
        <p className="text-neutral-400">Link to</p>
        <p className="mt-0.5 truncate text-neutral-700">
          {formatPreviewUrl(url)}
        </p>
      </div>
      <div className="aspect-[16/10] overflow-hidden rounded border border-neutral-200 bg-neutral-100">
        <picture>
          <source srcSet={`${previewBase}.avif`} type="image/avif" />
          <img
            src={`${previewBase}.webp`}
            alt=""
            width={MEDIA_SIZES.thumb.width}
            height={MEDIA_SIZES.thumb.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        </picture>
      </div>
    </div>
  );
}

// Screenshot projects for themes that show a gallery (Playground's carousel).
const carouselItems: CarouselItem[] = projects.flatMap((project) =>
  project.media.type === "image"
    ? [
        {
          slug: project.slug,
          name: project.name,
          category: project.category,
          src: project.media.src,
          alt: project.media.alt,
        },
      ]
    : [],
);

/**
 * Compact ledger: one ruled row per project with an inline thumbnail. The three
 * actions are the only links in a row, so keyboard order is Live → GitHub → Case study.
 */
export default function Projects() {
  return (
    <section aria-labelledby="projects" className="pb-14 sm:pb-20">
      <SectionHeading index="01" title="Projects" id="projects" />
      <ThemeSlot name="projects-intro" data={carouselItems} />

      <div className="mt-6 space-y-8 sm:mt-8 sm:space-y-10">
        {projectKinds.map(({ kind, label }) => {
          const group = projects.filter((p) => p.kind === kind);
          if (group.length === 0) return null;
          return (
            <div key={kind} data-ui="project-group">
              <h3
                data-ui="project-group-label"
                className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-neutral-400"
              >
                <span>
                  <ThemeText text={label} />
                </span>
                <span
                  aria-hidden="true"
                  data-ui="project-group-rule"
                  data-count={String(group.length).padStart(2, "0")}
                  className="h-px flex-1 bg-neutral-300/70"
                />
              </h3>
              <ul aria-label={label} className="divide-y divide-neutral-300/70">
                {group.map((project, index) => (
                  <li
                    key={project.slug}
                    data-ui="project-row"
                    data-kind={project.kind}
                    className="relative py-3 first:pt-0 last:pb-0 focus-within:z-[60] hover:z-[60]"
                  >
                    <Reveal
                      delay={Math.min(index, 3) * 0.04}
                      className="studio-grid max-md:grid-cols-[6.5rem_minmax(0,1fr)] max-md:gap-x-4 max-md:gap-y-2 md:gap-x-6 md:gap-y-0"
                    >
                      <div
                        data-ui="project-thumb"
                        className="relative aspect-[16/10] self-start overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 md:row-span-2"
                      >
                        <ProjectMedia project={project} variant="thumb" />
                        <ThemeSlot name="media-overlay" />
                      </div>

                      <div className="min-w-0 md:col-start-2 md:flex md:items-baseline md:justify-between md:gap-6">
                        <div className="min-w-0">
                          <h4
                            data-ui="project-name"
                            className="font-display text-base font-medium leading-snug tracking-[-0.02em] sm:text-lg"
                          >
                            <ThemeText text={project.name} />
                          </h4>
                          <p className="mt-1 max-w-[56ch] text-pretty text-sm leading-snug text-neutral-600">
                            {project.oneLiner}
                          </p>
                        </div>
                        <p
                          data-ui="project-meta"
                          className="mt-2 hidden shrink-0 whitespace-nowrap font-mono text-[11px] text-neutral-500 md:block"
                        >
                          {project.category} · {project.year}
                        </p>
                      </div>

                      <div className="min-w-0 max-md:col-span-2 md:col-start-2">
                        <p
                          data-ui="project-stack"
                          className="font-mono text-[11px] leading-relaxed text-neutral-500 md:mt-1"
                        >
                          <span className="sr-only">Built with: </span>
                          {project.stack.join(" · ")}
                        </p>
                        <p
                          data-ui="project-meta"
                          className="mt-0.5 font-mono text-[11px] text-neutral-500 md:hidden"
                        >
                          {project.category} · {project.year}
                        </p>

                        <div
                          data-ui="project-actions"
                          className="relative -ml-2 mt-1 flex flex-wrap items-center gap-x-1 md:mt-0.5"
                        >
                          {project.live && (
                            <div className="sm:relative">
                              <a
                                href={project.live}
                                {...external}
                                aria-label={`${project.name} live site`}
                                data-action="live"
                                className={actionClass}
                              >
                                <span>
                                  <ThemeLabel text="Live" />
                                </span>
                                <ArrowUpRight
                                  size={13}
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                  className="shrink-0"
                                />
                              </a>
                              <ActionPreview
                                url={project.live}
                                previewBase={`/projects/previews/${project.slug}-live`}
                              />
                            </div>
                          )}
                          {project.repo && (
                            <div className="sm:relative">
                              <a
                                href={project.repo}
                                {...external}
                                aria-label={`${project.name} on GitHub`}
                                data-action="github"
                                className={actionClass}
                              >
                                <span>
                                  <ThemeLabel text="GitHub" />
                                </span>
                                <ArrowUpRight
                                  size={13}
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                  className="shrink-0"
                                />
                              </a>
                              <ActionPreview
                                url={project.repo}
                                previewBase={`/projects/previews/${project.slug}-github`}
                              />
                            </div>
                          )}
                          <div className="sm:relative">
                            <Link
                              href={`/projects/${project.slug}`}
                              aria-label={`${project.name} case study`}
                              data-action="case-study"
                              className={actionClass}
                            >
                              <span>
                                <ThemeLabel text="Case study" />
                              </span>
                              <ArrowRight
                                size={13}
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                            </Link>
                            <ActionPreview
                              url={`/projects/${project.slug}`}
                              previewBase={`/projects/previews/${project.slug}-case-study`}
                            />
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
