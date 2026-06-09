import fs from "node:fs";
import path from "node:path";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import StackLine from "@/components/StackLine";

export default function Home() {
  // Build-time check: the Resume link only renders if the file actually exists.
  const hasResume = fs.existsSync(
    path.join(process.cwd(), "public", "resume.pdf")
  );

  return (
    <>
      <Header hasResume={hasResume} />
      <main className="mx-auto w-full max-w-site px-6">
        <Hero />
        <Projects />
        <Experience />
        <StackLine />
      </main>
      <Footer />
    </>
  );
}
