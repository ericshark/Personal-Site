"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  type Project,
  type ProjectCategoryId,
  projectCategories,
  projects,
} from "@/data/portfolio";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";

type Filter = "all" | ProjectCategoryId;

const filters: { id: Filter; label: string; blurb: string }[] = [
  {
    id: "all",
    label: "All",
    blurb:
      "Everything I've built or am building, from production APIs to weekend experiments.",
  },
  ...projectCategories,
];

const sizeClasses: Record<NonNullable<Project["size"]>, string> = {
  sm: "",
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  lg: "sm:col-span-2 sm:row-span-2",
};

function isFilter(value: string | null): value is Filter {
  return filters.some((filter) => filter.id === value);
}

function countFor(filter: Filter) {
  return filter === "all"
    ? projects.length
    : projects.filter((project) => project.category === filter).length;
}

/**
 * The /projects browser: category filters over an animated bento grid, with a
 * detail dialog. Filter and open project live in the URL (?category=…#slug),
 * so views can be linked to and survive a reload.
 */
export default function ProjectBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const hasMounted = useRef(false);

  // Static export: read the URL on the client instead of useSearchParams.
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get(
      "category",
    );
    if (isFilter(category)) setFilter(category);
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (projects.some((project) => project.slug === slug)) {
      setSelectedSlug(slug);
    }
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (!hasMounted.current) return;
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", filter);
    url.hash = selectedSlug ?? "";
    window.history.replaceState(window.history.state, "", url);
  }, [filter, selectedSlug]);

  const active = filters.find((item) => item.id === filter) ?? filters[0];
  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);
  const selected =
    projects.find((project) => project.slug === selectedSlug) ?? null;
  // Step through what the visitor sees; a deep link outside the filter uses all.
  const navigable = selected && visible.includes(selected) ? visible : projects;

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 md:max-w-[34rem]">
          <h2 className="flex items-baseline gap-3 text-2xl font-medium tracking-tight">
            {active.label === "All" ? "All projects" : active.label}
            <span className="font-mono text-xs font-normal text-neutral-500">
              {visible.length} {visible.length === 1 ? "project" : "projects"}
            </span>
          </h2>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-2 text-pretty leading-relaxed text-neutral-600"
            >
              {active.blurb}
            </motion.p>
          </AnimatePresence>
        </div>

        <div
          role="group"
          aria-label="Filter projects by category"
          className="-mx-6 flex gap-1 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-1 rounded-full border border-neutral-200 bg-neutral-100/60 p-1">
            {filters.map(({ id, label }) => {
              const isActive = id === filter;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(id)}
                  className={`relative isolate m-0 shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 font-mono text-xs transition-colors duration-200 ${
                    isActive ? "text-paper" : "text-neutral-600 hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-filter-pill"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-ink"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.45,
                      }}
                    />
                  )}
                  {label}
                  <span className="ml-1.5 tabular-nums opacity-60">
                    {countFor(id)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ul className="mt-8 grid auto-rows-[18rem] grid-flow-dense grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              transition={{
                type: "spring",
                bounce: 0.12,
                duration: 0.55,
                // Stagger only the first entrance, not every filter change.
                delay: hasMounted.current ? 0 : i * 0.05,
              }}
              className={sizeClasses[project.size ?? "sm"]}
            >
              <ProjectCard
                project={project}
                onSelect={() => setSelectedSlug(project.slug)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ProjectDetail
        project={selected}
        projects={navigable}
        onClose={() => setSelectedSlug(null)}
        onNavigate={setSelectedSlug}
      />
    </>
  );
}
