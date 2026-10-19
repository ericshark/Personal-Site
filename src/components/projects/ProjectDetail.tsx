"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { categoryLabel, hueStyle, statusStyles } from "./meta";
import ProjectPreview from "./previews/ProjectPreview";

/**
 * Project detail in a native modal <dialog>, which brings focus trapping,
 * Escape to close, and focus return for free. Arrow keys step through
 * `projects` (the list the visitor was browsing).
 */
export default function ProjectDetail({
  project,
  projects,
  onClose,
  onNavigate,
}: {
  project: Project | null;
  projects: Project[];
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Keep rendering the last project while the dialog animates closed.
  const [shown, setShown] = useState(project);
  const [direction, setDirection] = useState(0);

  if (project && project !== shown) setShown(project);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    }
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const isOpen = project !== null;
  useEffect(() => {
    if (!isOpen) return;
    // Lenis ignores events inside [data-lenis-prevent]; this stops the
    // native page scroll behind the modal as well.
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [shown?.slug]);

  const index = shown ? projects.indexOf(shown) : -1;
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;

  function go(target: Project | undefined, step: number) {
    if (!target) return;
    setDirection(step);
    onNavigate(target.slug);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") go(previous, -1);
    if (event.key === "ArrowRight") go(next, 1);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-dialog-title"
      data-lenis-prevent
      onClose={onClose}
      onKeyDown={onKeyDown}
      // A click that lands on the <dialog> itself (not its content) is the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="project-dialog accent-scope m-auto max-h-[min(92dvh,58rem)] w-[min(calc(100%-2rem),60rem)] max-w-none overflow-hidden rounded-2xl border border-neutral-200 bg-paper p-0 text-ink shadow-2xl max-sm:mb-0 max-sm:w-full max-sm:rounded-b-none"
      style={shown ? hueStyle(shown) : undefined}
    >
      {shown && (
        <div className="flex max-h-[inherit] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-1.5 pl-5 pr-2">
            <p className="truncate font-mono text-xs text-neutral-500">
              {categoryLabel[shown.category]}
              {index >= 0 && (
                <span className="text-neutral-400">
                  {" "}
                  · {String(index + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
              )}
            </p>
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                className="action-quiet disabled:pointer-events-none disabled:opacity-40"
                onClick={() => go(previous, -1)}
                disabled={!previous}
                aria-label={
                  previous ? `Previous: ${previous.name}` : "Previous project"
                }
              >
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="action-quiet disabled:pointer-events-none disabled:opacity-40"
                onClick={() => go(next, 1)}
                disabled={!next}
                aria-label={next ? `Next: ${next.name}` : "Next project"}
              >
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="action-quiet"
                onClick={onClose}
                aria-label="Close"
                ref={closeButtonRef}
              >
                <X size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="min-h-0 overflow-y-auto overscroll-contain"
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.article
                key={shown.slug}
                custom={direction}
                variants={{
                  enter: (step: number) => ({ opacity: 0, x: step * 32 }),
                  center: { opacity: 1, x: 0 },
                  exit: (step: number) => ({ opacity: 0, x: step * -32 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="p-3 sm:p-4">
                  <ProjectPreview
                    project={shown}
                    sizes="(min-width: 1024px) 60rem, 100vw"
                    className="aspect-[16/10] max-h-[24rem] w-full rounded-xl border border-neutral-200 sm:aspect-[16/8]"
                  />
                </div>

                <div className="grid gap-10 px-5 pb-10 pt-4 sm:px-8 md:grid-cols-[minmax(0,1fr)_15rem]">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-neutral-500">
                      {shown.kind}
                    </p>
                    <h2
                      id="project-dialog-title"
                      className="mt-2 text-3xl font-medium tracking-[-0.03em] sm:text-4xl"
                    >
                      {shown.name}
                    </h2>
                    <p className="mt-4 max-w-[60ch] text-pretty leading-relaxed text-neutral-600">
                      {shown.description}
                    </p>

                    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                      {shown.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded-lg border border-neutral-200 bg-neutral-100/50 px-3.5 py-3 text-sm leading-snug"
                        >
                          <span
                            aria-hidden="true"
                            className="mb-2 block h-1 w-5 rounded-full bg-[var(--pv)]"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
                      How it&rsquo;s built
                    </h3>
                    <ol className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600">
                      {shown.details.map((detail, i) => (
                        <li key={detail} className="flex gap-4">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 font-mono text-[11px] text-[var(--pv)]"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <aside className="space-y-7 md:border-l md:border-neutral-200 md:pl-6">
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 font-mono text-xs">
                      <dt className="text-neutral-500">Category</dt>
                      <dd>{categoryLabel[shown.category]}</dd>
                      <dt className="text-neutral-500">Status</dt>
                      <dd className="flex items-center gap-2 capitalize">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            statusStyles[shown.status],
                          )}
                        />
                        {shown.status}
                      </dd>
                      <dt className="text-neutral-500">Date</dt>
                      <dd>{shown.date}</dd>
                    </dl>

                    <div>
                      <p className="font-mono text-xs text-neutral-500">
                        Stack
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {shown.stack.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-neutral-200 px-2.5 py-1 font-mono text-[11px] text-neutral-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(shown.url || shown.demoUrl) && (
                      <div className="flex flex-col items-start gap-1 border-t border-neutral-200 pt-4">
                        {shown.demoUrl && (
                          <a
                            href={shown.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-quiet -ml-2 font-mono text-xs"
                          >
                            Live demo
                            <ArrowUpRight
                              size={14}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          </a>
                        )}
                        {shown.url && (
                          <a
                            href={shown.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${shown.name} on GitHub`}
                            className="action-quiet -ml-2 font-mono text-xs"
                          >
                            View on GitHub
                            <ArrowUpRight
                              size={14}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    )}

                    {shown.sample && (
                      <p className="rounded-lg border border-dashed border-neutral-300 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-neutral-500">
                        Sample project: placeholder content while this section
                        is being built out.
                      </p>
                    )}
                  </aside>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      )}
    </dialog>
  );
}
