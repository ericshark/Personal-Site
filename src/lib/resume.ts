import fs from "node:fs";
import path from "node:path";

/** Build-time check: Resume links only render if the file actually exists. */
export function hasResumeFile() {
  return fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));
}
