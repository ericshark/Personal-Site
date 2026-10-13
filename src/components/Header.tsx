"use client";

import { useEffect, useState } from "react";
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
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { isScrolled, activeId };
}

export default function Header({ hasResume }: { hasResume: boolean }) {
  const { isScrolled, activeId } = useScrollState();

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
        <nav aria-label="Site" className="min-w-0">
          <ul className="flex gap-4 font-mono text-xs text-neutral-500 max-[359px]:gap-3 sm:gap-8 sm:text-[0.8125rem]">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={activeId === id ? "location" : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
            {hasResume && (
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resume
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
