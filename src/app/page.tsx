import fs from "node:fs";
import path from "node:path";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  // Build-time check: the Resume link only renders if the file actually exists.
  const hasResume = fs.existsSync(
    path.join(process.cwd(), "public", "resume.pdf"),
  );

  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="mx-auto w-full max-w-site px-6 sm:px-8">
        <Hero hasResume={hasResume} />
        <Projects />
        <About />
        <Experience />
      </main>
      <Footer hasResume={hasResume} />
    </>
  );
}
