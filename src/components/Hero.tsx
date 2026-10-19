import { ArrowDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import SplitWords from "@/components/SplitWords";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { profile } from "@/data/portfolio";

const ABOUT_START_DELAY = 0.2;
const ABOUT_SPEED_REVEAL = 6;
// Mirrors TextEffect's per-char stagger so each paragraph starts revealing
// where the previous one finishes, instead of all three fading in at once.
const ABOUT_CHAR_STAGGER = 0.03 / ABOUT_SPEED_REVEAL;

const paragraphRevealDelays = profile.about.paragraphs.reduce<number[]>(
  (delays, _paragraph, index) => {
    const previous = profile.about.paragraphs[index - 1];
    delays.push(
      index === 0
        ? ABOUT_START_DELAY
        : delays[index - 1] + previous.length * ABOUT_CHAR_STAGGER,
    );
    return delays;
  },
  [],
);

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
          className="mt-12 grid gap-5 border-t border-neutral-300/70 pt-6 sm:mt-14 sm:grid-cols-[10rem_1fr] sm:gap-8 sm:pt-7"
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
            <p className="mt-1.5 flex items-center gap-2 whitespace-nowrap font-mono text-[11px] text-neutral-500">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-accent"
              />
              {profile.availability}
            </p>
          </div>
          <div>
            <div className="space-y-4">
              {profile.about.paragraphs.map((paragraph, index) => (
                <TextEffect
                  key={index}
                  per="char"
                  preset="fade"
                  as="p"
                  delay={paragraphRevealDelays[index]}
                  speedReveal={ABOUT_SPEED_REVEAL}
                  className="text-pretty leading-relaxed text-neutral-600"
                >
                  {paragraph}
                </TextEffect>
              ))}
            </div>
            <a href="#projects" className="link-arrow mt-6">
              <span>View projects</span>
              <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </Reveal>
    </section>
  );
}
