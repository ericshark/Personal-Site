"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";
import { profile } from "@/data/portfolio";

const sections = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const initials = profile.name
  .split(" ")
  .map((word) => word[0])
  .join("");

/**
 * Tracks whether the page has scrolled and which section is in view.
 * A section is "active" once its heading passes 40% of the viewport height;
 * at the very bottom the last section wins, since Contact can't reach the top.
 */
function useScrollState() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      setIsScrolled(window.scrollY > 8);

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(sections[sections.length - 1].id);
        return;
      }

      const threshold = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const { id } of sections) {
        const heading = document.getElementById(id);
        if (heading && heading.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActiveId(current);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Disclosures can move section headings without a scroll event.
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return { isScrolled, activeId };
}

export default function Header() {
  const { isScrolled, activeId } = useScrollState();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <header
      id="top"
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-200 ${
        isScrolled
          ? "border-neutral-200 bg-paper/85 backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-site items-center justify-between gap-4 px-6 sm:px-8">
        <a
          href="#top"
          aria-label={profile.name}
          className="shrink-0 font-medium tracking-tight"
        >
          <span className="sm:hidden">{initials}</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <div className="flex min-w-0 items-center gap-3 max-[359px]:gap-1 sm:gap-6">
          <nav aria-label="Site" className="min-w-0">
            <ul
              className="flex gap-4 font-mono text-xs text-neutral-500 max-[359px]:gap-3 sm:gap-8 sm:text-[0.8125rem]"
              onPointerLeave={() => setHoveredId(null)}
            >
              {sections.map(({ id, label }) => {
                // The pill follows the pointer, and rests on the active section otherwise.
                const isHighlighted = (hoveredId ?? activeId) === id;

                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      data-nav
                      aria-current={activeId === id ? "location" : undefined}
                      className={`relative isolate inline-block transition-colors duration-150 sm:-mx-2.5 sm:px-2.5 sm:py-1 ${
                        isHighlighted ? "text-paper" : ""
                      }`}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") {
                          setHoveredId(id);
                        }
                      }}
                    >
                      {isHighlighted && (
                        <motion.span
                          layoutId="nav-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-md bg-ink"
                          transition={{
                            type: "spring",
                            bounce: 0.15,
                            duration: 0.4,
                          }}
                        />
                      )}
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
