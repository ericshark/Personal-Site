import Reveal from "@/components/Reveal";
import { profile } from "@/data/portfolio";

export default function Hero() {
  return (
    <section aria-label="Introduction" className="pb-24 pt-20 sm:pb-36 sm:pt-32">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          {profile.role} — {profile.location}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-7 text-balance text-3xl font-medium leading-[1.18] tracking-tight sm:text-4xl sm:leading-[1.14] md:text-[2.625rem]">
          {profile.headline}
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-7 max-w-[58ch] text-pretty leading-relaxed text-neutral-600 sm:text-lg sm:leading-relaxed">
          {profile.subline}
        </p>
      </Reveal>
      <Reveal delay={0.24}>
        <ul className="mt-11 flex flex-wrap items-baseline gap-x-7 gap-y-2 font-mono text-sm">
          <li>
            <a className="link-quiet" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </li>
          <li>
            <a
              className="text-neutral-500 transition-colors duration-200 hover:text-ink"
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </li>
          <li>
            <a
              className="text-neutral-500 transition-colors duration-200 hover:text-ink"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
