import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { profile } from "@/data/portfolio";

export default function Hero({ hasResume }: { hasResume: boolean }) {
  return (
    <section
      aria-label="Introduction"
      className="pb-24 pt-20 sm:pb-28 sm:pt-32"
    >
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          {profile.role} — {profile.location}
        </p>
      </Reveal>
      <h1 className="mt-7 text-balance text-3xl font-medium leading-[1.18] tracking-tight sm:text-4xl sm:leading-[1.14] md:text-[2.625rem]">
        <SplitWords text={profile.headline} delay={0.08} />
      </h1>
      <Reveal delay={0.16}>
        <ul className="mt-9 flex flex-wrap items-baseline gap-x-7 gap-y-3 font-mono text-sm">
          <li>
            <a className="link-quiet" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </li>
          {hasResume && (
            <li>
              <a
                className="text-neutral-500"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume ↗
              </a>
            </li>
          )}
          <li>
            <a
              className="text-neutral-500"
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </li>
          <li>
            <a
              className="text-neutral-500"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          </li>
        </ul>
      </Reveal>
      <Reveal delay={0.24}>
        <aside
          aria-labelledby="hero-note-heading"
          className="mt-12 grid gap-5 border-t border-neutral-300/70 pt-6 sm:mt-14 sm:grid-cols-[9rem_1fr] sm:gap-8 sm:pt-7"
        >
          <div>
            <h2 id="hero-note-heading" className="font-mono text-xs text-ink">
              {profile.about.title}
            </h2>
            <p className="mt-2.5 whitespace-nowrap font-mono text-[11px] text-neutral-500">
              Updated{" "}
              <time dateTime={profile.about.updated.dateTime}>
                {profile.about.updated.label}
              </time>
            </p>
          </div>
          <p className="text-pretty leading-relaxed text-neutral-600">
            {profile.about.description}
          </p>
        </aside>
      </Reveal>
    </section>
  );
}
