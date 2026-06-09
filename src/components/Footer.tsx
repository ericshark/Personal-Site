import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-site px-6 pb-12 sm:px-8">
      <section aria-labelledby="contact">
        <SectionHeading index="03" title="Contact" id="contact" />

        <Reveal className="mt-12 sm:mt-16">
          <h3 className="max-w-[26ch] text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            Have a project, role, or technical problem in mind? Reach out.
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
            <li>
              <a
                className="transition-colors duration-200 hover:text-ink"
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            </li>
            <li>
              <a
                className="transition-colors duration-200 hover:text-ink"
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
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
