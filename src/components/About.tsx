import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { profile } from "@/data/portfolio";

export default function About() {
  return (
    <section aria-labelledby="about" className="pb-20 sm:pb-28">
      <SectionHeading index="02" title={profile.about.title} id="about" />
      <Reveal className="studio-grid mt-9 sm:mt-12">
        <p className="font-mono text-[11px] leading-relaxed text-neutral-500">
          Updated
          <br className="hidden md:block" />{" "}
          <time dateTime={profile.about.updated.dateTime}>
            {profile.about.updated.label}
          </time>
        </p>
        <p className="max-w-[62ch] text-pretty text-base leading-[1.8] text-neutral-600 sm:text-[17px]">
          {profile.about.description}
        </p>
      </Reveal>
    </section>
  );
}
