import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ProjectMedia, { Screenshot } from "@/components/ProjectMedia";
import Reveal from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import { projects, type Project } from "@/data/portfolio";

// Static export: only the listed slugs exist; anything else is the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} — case study`;
  const description = `${project.oneLiner} ${project.category}, ${project.year}.`;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description, type: "article", locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const panel = "rounded-lg border border-neutral-200 bg-neutral-100 p-4";
const panelLabel = "font-mono text-[11px] text-neutral-500";
const metricColumns: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

function host(url: string) {
  return new URL(url).host;
}

function Actions({ project }: { project: Project }) {
  const button =
    "action-quiet min-h-10 border border-neutral-300 px-3.5 font-mono text-xs hover:border-neutral-400";
  return (
    <div className="flex flex-wrap gap-2">
      {project.live && (
        <a
          href={project.live}
          {...external}
          aria-label={`${project.name} live site`}
          className={`${button} border-ink text-ink`}
        >
          Live
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </a>
      )}
      {project.repo && (
        <a
          href={project.repo}
          {...external}
          aria-label={`${project.name} on GitHub`}
          className={button}
        >
          GitHub
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-neutral-200 py-2.5 first:border-t-0 first:pt-0 last:pb-0">
      <dt className={panelLabel}>{label}</dt>
      <dd className="mt-1 text-sm leading-snug text-neutral-700">{children}</dd>
    </div>
  );
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const { caseStudy } = project;
  // Wrap around so every page has both links.
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const navLink = "action-quiet min-h-10 px-2.5 font-mono text-xs sm:px-3";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-6 sm:px-8">
          <Link
            href="/#projects"
            className="action-quiet -ml-2 font-mono text-xs"
          >
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
            All projects
          </Link>
          <nav aria-label="Project navigation" className="flex items-center">
            <Link
              href={`/projects/${previous.slug}`}
              aria-label={`Previous project: ${previous.name}`}
              className={navLink}
            >
              <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden sm:inline">{previous.name}</span>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              aria-label={`Next project: ${next.name}`}
              className={navLink}
            >
              <span className="hidden sm:inline">{next.name}</span>
              <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-6 sm:px-8 sm:pt-8">
        <Reveal className="grid gap-x-8 gap-y-4 pb-5 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <p className="font-mono text-xs text-neutral-500">
              {project.category} · {project.year}
            </p>
            <h1 className="mt-3 text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-2 max-w-[60ch] text-pretty text-base leading-snug text-neutral-700">
              {project.oneLiner}
            </p>
            <p className="mt-2 max-w-[72ch] text-pretty text-sm leading-relaxed text-neutral-600">
              {caseStudy.summary}
            </p>
          </div>
          <div className="lg:col-span-4 lg:self-end lg:justify-self-end">
            <Actions project={project} />
          </div>
        </Reveal>

        <div className="grid gap-3 lg:grid-cols-12">
          <figure className="min-w-0 lg:col-span-8">
            <div className="aspect-[16/10] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <ProjectMedia project={project} variant="media" eager />
            </div>
          </figure>

          <section
            aria-labelledby="facts"
            className={`${panel} min-w-0 lg:col-span-4`}
          >
            <h2 id="facts" className="sr-only">
              Project facts
            </h2>
            <dl>
              <Fact label="Role">{caseStudy.role}</Fact>
              <Fact label="Year">{project.year}</Fact>
              {caseStudy.status && (
                <Fact label="Status">{caseStudy.status}</Fact>
              )}
              <Fact label="Stack">
                <span className="font-mono text-xs leading-relaxed">
                  {project.stack.join(" · ")}
                </span>
              </Fact>
              <Fact label="Links">
                <span className="flex flex-col items-start font-mono text-xs">
                  {project.live && (
                    <a
                      href={project.live}
                      {...external}
                      className="action-quiet -ml-2 min-h-8 py-1"
                    >
                      {host(project.live)}
                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      {...external}
                      className="action-quiet -ml-2 min-h-8 py-1"
                    >
                      {project.repo.replace("https://github.com/", "")}
                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </span>
              </Fact>
            </dl>
          </section>

          <section aria-labelledby="metrics" className="lg:col-span-12">
            <h2 id="metrics" className="sr-only">
              Metrics
            </h2>
            <ul
              className={`grid grid-cols-2 gap-3 ${metricColumns[caseStudy.metrics.length] ?? "lg:grid-cols-4"}`}
            >
              {caseStudy.metrics.map((metric) => (
                <li
                  key={metric.label}
                  className="min-w-0 rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-3"
                >
                  <p className="text-2xl font-medium leading-none tracking-tight">
                    {metric.value}
                  </p>
                  <p className="mt-2 font-mono text-[11px] leading-snug text-neutral-500">
                    {metric.label}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {(caseStudy.architecture || caseStudy.decisions.length > 0) && (
          <Reveal className="mt-3 grid gap-3">
            {caseStudy.architecture && (
              <section aria-labelledby="architecture" className={panel}>
                <h2 id="architecture" className={`${panelLabel} mb-3`}>
                  Architecture
                </h2>
                <ArchitectureDiagram architecture={caseStudy.architecture} />
              </section>
            )}

            {caseStudy.decisions.length > 0 && (
              <section aria-labelledby="decisions" className={panel}>
                <h2 id="decisions" className={`${panelLabel} mb-3`}>
                  Key decisions
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {caseStudy.decisions.map((decision) => (
                    <li
                      key={decision.title}
                      className="rounded-md border border-neutral-200 bg-paper p-3.5"
                    >
                      <h3 className="text-[0.9375rem] font-medium leading-snug tracking-tight">
                        {decision.title}
                      </h3>
                      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-neutral-600">
                        {decision.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </Reveal>
        )}

        {caseStudy.gallery && caseStudy.gallery.length > 0 && (
          <Reveal className="mt-3">
            <section aria-labelledby="gallery" className={panel}>
              <h2 id="gallery" className={`${panelLabel} mb-3`}>
                Gallery
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {caseStudy.gallery.map((shot) => (
                  <li key={shot.src}>
                    <figure>
                      <div className="aspect-[16/10] overflow-hidden rounded-md border border-neutral-200">
                        <Screenshot
                          src={shot.src}
                          alt={shot.alt}
                          variant="media"
                        />
                      </div>
                      {shot.caption && (
                        <figcaption className="mt-2 font-mono text-[11px] text-neutral-500">
                          {shot.caption}
                        </figcaption>
                      )}
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}
      </main>
    </>
  );
}
