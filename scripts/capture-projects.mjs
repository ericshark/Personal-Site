/**
 * Capture and encode project screenshots.
 *
 *   npm run screenshots                  capture every deployed image project, then encode
 *   npm run screenshots -- --encode-only re-encode from assets/project-sources/ (no network)
 *   npm run screenshots -- --only geopractice
 *
 * Capture: headless Chromium opens each project's live URL (from
 * src/data/portfolio.ts) at 1440×900 and saves assets/project-sources/<slug>.jpg.
 * Encode: sharp writes public/projects/<slug>-{thumb,media}.{avif,webp}. The
 * sizes must match MEDIA_SIZES in src/components/ProjectMedia.tsx.
 * Projects with a designed visual (media.type !== "image") are skipped.
 */
import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { projects } from "../src/data/portfolio.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "assets", "project-sources");
const outDir = path.join(root, "public", "projects");

const SIZES = {
  thumb: { width: 480, height: 300 },
  media: { width: 1280, height: 800 },
};
// Time for 3D scenes and entrance animations to settle before the screenshot.
const SETTLE_MS = 4000;

const args = process.argv.slice(2);
const encodeOnly = args.includes("--encode-only");
const onlyIndex = args.indexOf("--only");
const only = onlyIndex === -1 ? null : args[onlyIndex + 1];

const targets = projects.filter(
  (p) => p.media.type === "image" && (!only || p.slug === only),
);
if (targets.length === 0) {
  console.error(
    only ? `No image project with slug "${only}".` : "Nothing to do.",
  );
  process.exit(1);
}

async function capture() {
  await mkdir(sourceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const project of targets) {
      if (!project.live) {
        console.warn(`skip ${project.slug}: no live URL`);
        continue;
      }
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
      });
      await page.goto(project.live, { waitUntil: "load", timeout: 45_000 });
      await page.waitForTimeout(SETTLE_MS);
      const file = path.join(sourceDir, `${project.slug}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: 92 });
      await page.close();
      console.log(`captured ${project.slug}`);
    }
  } finally {
    await browser.close();
  }
}

async function encode() {
  await mkdir(outDir, { recursive: true });
  for (const project of targets) {
    const source = path.join(sourceDir, `${project.slug}.jpg`);
    try {
      await access(source);
    } catch {
      console.warn(
        `skip ${project.slug}: missing ${path.relative(root, source)}`,
      );
      continue;
    }
    // media.src is "/projects/<name>"; output files follow it so the page finds them.
    const base = path.join(root, "public", project.media.src);
    for (const [variant, { width, height }] of Object.entries(SIZES)) {
      const resized = sharp(source).resize(width, height, {
        fit: "cover",
        position: "top",
      });
      await resized
        .clone()
        .avif({ quality: 55, effort: 6 })
        .toFile(`${base}-${variant}.avif`);
      await resized
        .clone()
        .webp({ quality: 78 })
        .toFile(`${base}-${variant}.webp`);
    }
    console.log(`encoded ${project.slug}`);
  }
}

if (!encodeOnly) await capture();
await encode();
