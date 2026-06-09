import Reveal from "@/components/Reveal";
import { profile } from "@/data/portfolio";

export default function Hero() {
  return (
    <section aria-label="Introduction" className="pb-24 pt-24 sm:pb-32 sm:pt-32">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          {profile.role} — {profile.location}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-6 max-w-[24ch] text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl md:text-[2.75rem]">
          {profile.headline}
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-6 max-w-[52ch] leading-relaxed text-neutral-600">
          {profile.subline}
        </p>
      </Reveal>
      <Reveal delay={0.24}>
        <p className="mt-10 font-mono text-sm">
          <a className="link-quiet" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </p>
      </Reveal>
    </section>
  );
}
