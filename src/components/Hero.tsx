import { ArrowDown, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/portfolio";

export default function Hero({ hasResume }: { hasResume: boolean }) {
  return (
    <section
      aria-label="Introduction"
      className="pb-16 pt-12 sm:pb-20 sm:pt-20"
    >
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 font-mono text-[11px] text-neutral-500">
          <p className="uppercase tracking-[0.14em]">{profile.role}</p>
          <p>{profile.location}</p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <h1 className="mt-7 max-w-[24ch] text-balance font-display text-[2.5rem] font-normal leading-[1.08] tracking-[-0.025em] sm:mt-9 sm:text-[3.75rem] lg:max-w-[26ch] lg:text-[4.25rem]">
          {profile.headline}
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-6 max-w-[44ch] text-pretty text-base leading-relaxed text-neutral-600 sm:mt-7 sm:text-lg">
          {profile.introduction}
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-8">
          <a
            href="#projects"
            className="inline-flex min-h-11 items-center gap-5 rounded-sm bg-ink px-5 py-3 text-sm text-paper transition-colors duration-150 hover:bg-neutral-700"
          >
            View projects
            <ArrowDown size={15} strokeWidth={1.5} aria-hidden="true" />
          </a>
          {hasResume && (
            <a
              className="link-arrow link-quiet font-mono text-xs text-neutral-600"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-6 font-mono text-xs text-neutral-500 sm:mt-5">
          <li>
            <a
              className="link-arrow link-quiet"
              href={`mailto:${profile.email}`}
            >
              Email
              <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              className="link-arrow link-quiet"
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              className="link-arrow link-quiet"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
