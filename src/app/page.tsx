import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ScrollProgress from "@/components/ScrollProgress";
import { profile, siteMeta } from "@/data/portfolio";
import { hasResumeFile } from "@/lib/resume";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteMeta.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location,
  },
  sameAs: [profile.links.github, profile.links.linkedin],
};

export default function Home() {
  const hasResume = hasResumeFile();

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so profile text can't close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ScrollProgress />
      <Header />
      <main className="mx-auto w-full max-w-site px-6 sm:px-8">
        <Hero hasResume={hasResume} />
        <Projects />
        <Experience />
      </main>
      <Footer hasResume={hasResume} />
    </>
  );
}
