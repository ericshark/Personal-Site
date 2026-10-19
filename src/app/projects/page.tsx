import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import SplitWords from "@/components/SplitWords";
import ProjectBrowser from "@/components/projects/ProjectBrowser";
import { profile, projectCategories, projects } from "@/data/portfolio";
import { hasResumeFile } from "@/lib/resume";

export const metadata: Metadata = {
  title: `Projects — ${profile.name}`,
  description:
    "Interfaces, browser games, tools and backends, and lab experiments by Eric Zwierzynski.",
};

export default function ProjectsPage() {
  const hasResume = hasResumeFile();

  return (
    <>
      <ScrollProgress />
      <Header page="projects" />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32">
        <section
          aria-labelledby="projects-title"
          className="pb-12 pt-16 sm:pb-16 sm:pt-24"
        >
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
              Index — {projects.length} projects · {projectCategories.length}{" "}
              categories
            </p>
          </Reveal>
          <h1
            id="projects-title"
            className="mt-7 max-w-[22ch] text-balance text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
          >
            <SplitWords
              text="Things I’ve built, and things I’m building."
              delay={0.06}
            />
          </h1>
        </section>

        <section aria-label="Project browser">
          <ProjectBrowser />
        </section>
      </main>
      <Footer hasResume={hasResume} wide />
    </>
  );
}
