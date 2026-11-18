/**
 * Capture and encode project screenshots.
 *
 *   npm run screenshots                  capture every deployed image project, then encode
 *   npm run screenshots -- --encode-only re-encode from assets/project-sources/ (no network)
 *   npm run screenshots -- --only geopractice
 *   npm run screenshots -- --previews [--base-url http://localhost:3002]
 *
 * Capture: headless Chromium opens each project's live URL (from
 * src/data/portfolio.ts) at 1440×900 and saves assets/project-sources/<slug>.jpg.
 * Encode: sharp writes public/projects/<slug>-{thumb,media}.{avif,webp}. The
 * sizes must match MEDIA_SIZES in src/components/ProjectMedia.tsx.
 * With --previews, also captures and encodes Live, GitHub, and Case study link
 * preview thumbnails into public/projects/previews/<slug>-{live,github,case-study}.{avif,webp}.
 */
import { mkdir, access, readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { projects } from "../src/data/portfolio.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "assets", "project-sources");
const previewSourceDir = path.join(sourceDir, "previews");
const outDir = path.join(root, "public", "projects");
const previewOutDir = path.join(outDir, "previews");

const SIZES = {
  thumb: { width: 480, height: 300 },
  media: { width: 1280, height: 800 },
};
// Time for 3D scenes and entrance animations to settle before the screenshot.
const SETTLE_MS = 4000;

const args = process.argv.slice(2);
const encodeOnly = args.includes("--encode-only");
const previewsMode = args.includes("--previews");
const localOnly = args.includes("--local-only");
const force = args.includes("--force");
const onlyIndex = args.indexOf("--only");
const only = onlyIndex === -1 ? null : args[onlyIndex + 1];
const baseUrlIndex = args.indexOf("--base-url");
const explicitBaseUrl = baseUrlIndex === -1 ? null : args[baseUrlIndex + 1];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

async function startStaticOutServer() {
  const staticRoot = path.join(root, "out");
  const server = http.createServer(async (req, res) => {
    const reqPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    if (reqPath.startsWith("/_vercel/")) {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end("");
      return;
    }
    const candidates = [
      path.join(staticRoot, reqPath),
      path.join(staticRoot, `${reqPath}.html`),
      path.join(staticRoot, reqPath, "index.html"),
    ];
    for (const candidate of candidates) {
      try {
        const data = await readFile(candidate);
        const ext = path.extname(candidate);
        res.writeHead(200, {
          "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
        });
        res.end(data);
        return;
      } catch {
        // try next candidate
      }
    }
    res.writeHead(404);
    res.end("Not found");
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      resolve({
        url: `http://127.0.0.1:${addr.port}`,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}

const targets = projects.filter(
  (p) => p.media.type === "image" && (!only || p.slug === only),
);
const previewTargets = projects.filter((p) => !only || p.slug === only);

if (!previewsMode && targets.length === 0) {
  console.error(
    only ? `No image project with slug "${only}".` : "Nothing to do.",
  );
  process.exit(1);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
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

async function capturePreviews() {
  await mkdir(previewSourceDir, { recursive: true });
  const staticServer = explicitBaseUrl ? null : await startStaticOutServer();
  const baseUrl = explicitBaseUrl ?? staticServer.url;
  const browser = await chromium.launch({ headless: true });
  try {
    for (const project of previewTargets) {
      // 1. Case study page preview (local static build)
      const caseStudyPreviewSource = path.join(
        previewSourceDir,
        `${project.slug}-case-study.jpg`,
      );
      if ((force || !(await fileExists(caseStudyPreviewSource))) && baseUrl) {
        const page = await browser.newPage({
          viewport: { width: 1440, height: 900 },
          deviceScaleFactor: 1,
          colorScheme: "light",
        });
        await page.goto(`${baseUrl}/projects/${project.slug}`, {
          waitUntil: "networkidle",
          timeout: 45_000,
        });
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: caseStudyPreviewSource,
          type: "jpeg",
          quality: 92,
        });
        await page.close();
        console.log(`captured preview ${project.slug} (case-study)`);
      }

      if (localOnly) continue;

      // 2. Live site preview (reuse existing project-sources/<slug>.jpg if present)
      if (project.live) {
        const existingMainSource = path.join(sourceDir, `${project.slug}.jpg`);
        const livePreviewSource = path.join(
          previewSourceDir,
          `${project.slug}-live.jpg`,
        );
        if (
          !(await fileExists(existingMainSource)) &&
          (force || !(await fileExists(livePreviewSource)))
        ) {
          const page = await browser.newPage({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1,
          });
          await page.goto(project.live, { waitUntil: "load", timeout: 45_000 });
          await page.waitForTimeout(SETTLE_MS);
          await page.screenshot({
            path: livePreviewSource,
            type: "jpeg",
            quality: 92,
          });
          await page.close();
          console.log(`captured preview ${project.slug} (live)`);
        }
      }

      // 3. GitHub repo preview
      if (project.repo) {
        const githubPreviewSource = path.join(
          previewSourceDir,
          `${project.slug}-github.jpg`,
        );
        if (force || !(await fileExists(githubPreviewSource))) {
          const page = await browser.newPage({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1,
            colorScheme: "light",
          });
          await page.goto(project.repo, {
            waitUntil: "domcontentloaded",
            timeout: 45_000,
          });
          await page.waitForTimeout(2000);
          await page.screenshot({
            path: githubPreviewSource,
            type: "jpeg",
            quality: 92,
          });
          await page.close();
          console.log(`captured preview ${project.slug} (github)`);
        }
      }
    }
  } finally {
    await browser.close();
    if (staticServer) await staticServer.close();
  }
}

async function encodeThumbFile(source, destBase) {
  const { width, height } = SIZES.thumb;
  const resized = sharp(source).resize(width, height, {
    fit: "cover",
    position: "top",
  });
  await resized
    .clone()
    .avif({ quality: 55, effort: 6 })
    .toFile(`${destBase}.avif`);
  await resized.clone().webp({ quality: 78 }).toFile(`${destBase}.webp`);
}

async function encode() {
  await mkdir(outDir, { recursive: true });
  for (const project of targets) {
    const source = path.join(sourceDir, `${project.slug}.jpg`);
    if (!(await fileExists(source))) {
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

async function encodePreviews() {
  await mkdir(previewOutDir, { recursive: true });
  for (const project of previewTargets) {
    if (project.live) {
      const mainSource = path.join(sourceDir, `${project.slug}.jpg`);
      const previewSource = path.join(
        previewSourceDir,
        `${project.slug}-live.jpg`,
      );
      const source = (await fileExists(previewSource))
        ? previewSource
        : (await fileExists(mainSource))
          ? mainSource
          : null;
      if (source) {
        await encodeThumbFile(
          source,
          path.join(previewOutDir, `${project.slug}-live`),
        );
        console.log(`encoded preview ${project.slug}-live`);
      }
    }

    if (project.repo) {
      const source = path.join(previewSourceDir, `${project.slug}-github.jpg`);
      if (await fileExists(source)) {
        await encodeThumbFile(
          source,
          path.join(previewOutDir, `${project.slug}-github`),
        );
        console.log(`encoded preview ${project.slug}-github`);
      }
    }

    const caseStudySource = path.join(
      previewSourceDir,
      `${project.slug}-case-study.jpg`,
    );
    if (await fileExists(caseStudySource)) {
      await encodeThumbFile(
        caseStudySource,
        path.join(previewOutDir, `${project.slug}-case-study`),
      );
      console.log(`encoded preview ${project.slug}-case-study`);
    }
  }
}

if (previewsMode) {
  if (!encodeOnly) await capturePreviews();
  await encodePreviews();
} else {
  if (!encodeOnly) await capture();
  await encode();
  await encodePreviews();
}
