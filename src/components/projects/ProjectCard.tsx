"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { categoryLabel, hueStyle, statusStyles } from "./meta";
import ProjectPreview from "./previews/ProjectPreview";

type ProjectCardProps = {
  project: Project;
  className?: string;
} & (
  { href: string; onSelect?: never } | { href?: never; onSelect: () => void }
);

/** Feeds the pointer position to the spotlight ring in `.project-card`. */
function trackPointer(event: React.PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--x",
    `${event.clientX - rect.left}px`,
  );
  event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
}

// The name's link or button stretches over the whole card with ::after, so
// the card is one big target while the heading stays valid, readable markup.
const stretchedTarget =
  "m-0 rounded-none p-0 text-left after:absolute after:inset-0 after:z-10 after:rounded-2xl focus-visible:outline-none";

/**
 * Bento card: a live preview over the project's name and meta. The name is a
 * link (home page deep links) or a button (opens the detail dialog).
 */
export default function ProjectCard({
  project,
  className,
  href,
  onSelect,
}: ProjectCardProps) {
  return (
    <article
      className={cn("project-card accent-scope group", className)}
      style={hueStyle(project)}
      onPointerMove={trackPointer}
    >
      <div className="relative m-2 mb-0 min-h-0 flex-1">
        <ProjectPreview
          project={project}
          // Keep the drawing clear of the category and Sample chips.
          className="h-full rounded-xl border border-neutral-200 [&>.preview-stage]:top-8"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full border border-neutral-200 bg-paper/85 px-2 py-0.5 font-mono text-[10px] text-neutral-600 backdrop-blur">
          {categoryLabel[project.category]}
        </span>
        {project.sample && (
          <span className="absolute right-2.5 top-2.5 rounded-full border border-dashed border-neutral-300 bg-paper/85 px-2 py-0.5 font-mono text-[10px] text-neutral-500 backdrop-blur">
            Sample
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium tracking-[-0.02em]">
            {href ? (
              <a href={href} className={stretchedTarget}>
                {project.name}
              </a>
            ) : (
              <button
                type="button"
                onClick={onSelect}
                aria-haspopup="dialog"
                className={stretchedTarget}
              >
                {project.name}
              </button>
            )}
          </h3>
          <p className="mt-0.5 truncate text-sm text-neutral-500">
            {project.kind}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-neutral-500">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              statusStyles[project.status],
            )}
          />
          <span className="sr-only">Status: {project.status}.</span>
          <span aria-hidden="true">{project.date.split(" ").at(-1)}</span>
          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
            aria-hidden="true"
            className="text-neutral-400"
          />
        </div>
      </div>
    </article>
  );
}
