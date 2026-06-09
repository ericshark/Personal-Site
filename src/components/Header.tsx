import { profile } from "@/data/portfolio";

export default function Header({ hasResume }: { hasResume: boolean }) {
  return (
    <header
      id="top"
      className="mx-auto flex w-full max-w-site items-baseline justify-between px-6 pt-10 sm:pt-14"
    >
      <a href="#top" className="font-medium tracking-tight">
        {profile.name}
      </a>
      <nav aria-label="Site">
        <ul className="flex gap-5 font-mono text-xs text-neutral-500 sm:gap-7">
          <li>
            <a className="transition-colors duration-200 hover:text-ink" href="#projects">
              Projects
            </a>
          </li>
          <li>
            <a className="transition-colors duration-200 hover:text-ink" href="#experience">
              Experience
            </a>
          </li>
          <li>
            <a className="transition-colors duration-200 hover:text-ink" href="#contact">
              Contact
            </a>
          </li>
          {hasResume && (
            <li>
              <a
                className="transition-colors duration-200 hover:text-ink"
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
    </header>
  );
}
