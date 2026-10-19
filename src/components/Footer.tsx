import CurrentYear from "@/components/CurrentYear";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/portfolio";

export default function Footer({ hasResume }: { hasResume: boolean }) {
  return (
    <footer className="mx-auto w-full max-w-site px-6 pb-12 sm:px-8">
      <section aria-labelledby="contact">
        <SectionHeading index="03" title="Contact" id="contact" />

        <Reveal className="mt-12 sm:mt-16">
          <p className="mb-5 flex items-center gap-2 font-mono text-xs text-neutral-500">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-accent"
            />
            {profile.availability}
          </p>
          <h3 className="max-w-[26ch] text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            {profile.contactHeadline}
          </h3>
          <p className="mt-9">
            <a
              className="link-quiet font-mono text-base sm:text-lg"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
          </p>
          <ul className="mt-7 flex flex-wrap items-baseline gap-x-7 gap-y-2 font-mono text-xs text-neutral-500">
            {hasResume && (
              <li>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  Resume ↗
                </a>
              </li>
            )}
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            </li>
            <li>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </li>
            <li>{profile.location}</li>
          </ul>
        </Reveal>
      </section>

      <p className="mt-24 border-t border-neutral-200 pt-6 font-mono text-xs text-neutral-400">
        © <CurrentYear /> {profile.name}
      </p>
    </footer>
  );
}
