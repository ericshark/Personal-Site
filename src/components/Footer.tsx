import { ArrowUp, ArrowUpRight } from "lucide-react";
import ContactEmail from "@/components/ContactEmail";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/portfolio";

export default function Footer({ hasResume }: { hasResume: boolean }) {
  return (
    <footer className="mx-auto w-full max-w-site px-6 pb-6 sm:px-8 sm:pb-8">
      <section aria-labelledby="contact">
        <SectionHeading index="04" title="Contact" id="contact" />

        <Reveal className="studio-grid mt-9 sm:mt-12">
          <p className="font-mono text-[11px] leading-relaxed text-neutral-500">
            Say hello.
            <br className="hidden md:block" />{" "}
            <span className="md:mt-2 md:block">{profile.location}</span>
          </p>
          <div className="min-w-0">
            <h3 className="max-w-[26ch] text-balance font-display text-[2.5rem] font-normal leading-[1.12] tracking-[-0.02em] sm:text-[3.25rem]">
              {profile.contactHeadline}
            </h3>

            <ContactEmail email={profile.email} />

            <ul className="mt-3 flex flex-wrap gap-x-6 font-mono text-xs text-neutral-500">
              {hasResume && (
                <li>
                  <a
                    className="link-arrow link-quiet"
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )}
              <li>
                <a
                  className="link-arrow link-quiet"
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
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
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-neutral-300/70 pt-4 font-mono text-[10px] text-neutral-500 sm:mt-24 sm:text-[11px]">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a
          href="#top"
          className="link-quiet inline-flex min-h-11 items-center gap-2"
        >
          Back to top
          <ArrowUp size={12} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
