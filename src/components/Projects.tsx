import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/projects/ProjectCard";
import { projectCategories, projects } from "@/data/portfolio";

const featured = projects.filter((project) => project.featured);

/** Home page Featured strip; the full collection lives on /projects. */
export default function Projects() {
  return (
    <section aria-labelledby="projects" className="pb-20 sm:pb-28">
      <SectionHeading index="01" title="Projects" id="projects" />

      <Reveal className="mt-9 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 sm:mt-12">
        <p className="font-mono text-xs text-neutral-500">
          Featured — {featured.length} of {projects.length}
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-neutral-500">
          {projectCategories.map((category) => (
            <li key={category.id}>
              <a href={`/projects?category=${category.id}`}>
                {category.label}{" "}
                <span className="tabular-nums text-neutral-400">
                  {
                    projects.filter(
                      (project) => project.category === category.id,
                    ).length
                  }
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <ul className="mt-6 grid auto-rows-[17rem] gap-3 sm:grid-cols-2 sm:gap-4">
        {featured.map((project, i) => (
          <li key={project.slug} className="[&>div]:h-full">
            <Reveal delay={(i % 2) * 0.08} className="h-full">
              <ProjectCard
                project={project}
                href={`/projects#${project.slug}`}
              />
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-8">
        <a href="/projects" className="link-arrow">
          <span>Browse all {projects.length} projects</span>
          <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  );
}
