# Presenting 6–7 projects: research and directions to prototype

Researched 2026-11-13. Every portfolio described below was fetched on that date, as markdown, raw HTML, or a screenshot. Anything not confirmed that way is marked **(unverified)**.

## Summary

- **No well-regarded portfolio I checked puts everything on the homepage.** Each one splits the work across pages in one of three ways:
  - **Short homepage list → detail pages.** Samuel Kraft links to `/project/<slug>`. Dennis Snellenberg links to `/work/<slug>`.
  - **Featured items → full archive.** Brittany Chiang links to `/archive`.
  - **Projects vs. craft.** Rauno Freiberg separates `/projects` from `/craft`. Paco Coursey separates "Projects" from `/craft`.
- **Design engineers usually keep the homepage text-only.** Paco, Emil Kowalski, Jakub Krehel, Brian Lovin and Lee Robinson all use a single text column. Their rich media sits on a second page, such as Rauno's `/craft`. Samuel Kraft is the exception that still feels restrained: a narrow column of uniform image cards with captions, which is close to this site's `max-w-site` (48rem) column.
- **This body of work is mixed: backend-heavy (Agent Tracer, AuthCore), visual (Event Horizon, World Observatory, Interaction Playground) and product (GeoGuessr Academy, HumanRank).** For a hiring audience, a homepage that leads with two or three items, plus `/projects/[slug]` case-study pages, fits best. The case-study template should change depending on whether the project is mostly engineering or mostly visual.
- **The site uses `output: "export"` (`next.config.mjs`), which limits images.** With a static export, `next/image` optimization needs a custom loader. The default loader is unsupported ([Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)). Plan the media pipeline (pre-encoded AVIF/WebP plus MP4/WebM loops) before choosing a direction.

---

## 1. Information architecture

| Pattern | Verified example | What it does |
|---|---|---|
| Homepage only, text | [paco.me](https://paco.me), [emilkowal.ski](https://emilkowal.ski), [jakub.kr](https://jakub.kr), [brianlovin.com](https://brianlovin.com) | Each project is a linked name plus a one-line description. Links go to GitHub or the product's own site. None of these have case-study pages; their writing (`/writing/…`, `/ui/…`) does that job. |
| Homepage list → case studies | [samuelkraft.com](https://samuelkraft.com) | Stacked image cards. Some open internal case studies (`/project/bitrefill`, `/project/trailroutes`); others open external product sites. |
| Featured → archive | [brittanychiang.com](https://brittanychiang.com), [brittanychiang.com/archive](https://brittanychiang.com/archive) | The homepage shows four projects with thumbnail, description and tech tags, then "View Full Project Archive". The archive is a table with columns Year / Project / Made at / Built with / Link. |
| Separate index with case studies | [dennissnellenberg.com/work](https://dennissnellenberg.com/work) | A table-like index (Client / Location / Services / Year) with category filters ("Design 7", "Development 11") and a list/grid toggle (seen in the screenshot). Rows link to `/work/<slug>`. |
| Projects vs. craft/lab split | [rauno.me/projects](https://rauno.me/projects) + [rauno.me/craft](https://rauno.me/craft); [paco.me/craft](https://paco.me/craft) | Rauno's `/projects` is a text list of ten titles with years, all linking to external sites. `/craft` is a three-column masonry of media cards (title, month and year, a looping clip, and a "View Production", "View Prototype" or "Read Essay" button). Paco's `/craft` is a text list grouped into Motion, CSS and Interaction, linking to `/craft/<slug>` demos. |
| Categorised index | [antfu.me/projects](https://antfu.me/projects), [sajidkalam.com/projects](https://sajidkalam.com/projects) | Anthony Fu groups about 23 categories of name-plus-description cards. Sajid Kalam's index has one featured card ("Role / Period / Status", "Read the case study") above filtered cards that link to `/projects/<slug>`. |

**Recommendation for this audience: homepage featured + `/projects/[slug]` case studies.** Optionally add a work/lab distinction. The reasoning:

- **Homepage-only cannot hold architecture diagrams, decisions and media for 7 projects.** That matches the owner's concern. The text-only homepages above work because those people are already known: their projects are famous libraries such as ⌘K, Sonner and Vaul, and the GitHub link does the convincing (paco.me, emilkowal.ski).
- **Case-study pages give engineering projects room for diagrams and trade-offs, and give visual projects room for media.** This is what [samuelkraft.com/project/trailroutes](https://samuelkraft.com/project/trailroutes) and [dennissnellenberg.com/work](https://dennissnellenberg.com/work) do.
- **A separate `/projects` index only pays off past roughly 10 items** (Brittany Chiang's archive, Anthony Fu). At 7 items, the homepage can link straight to the case studies. An index page is optional.
- **A lab split (Rauno, Paco) lets the craft pieces (Interaction Playground, Event Horizon) show off without diluting the hiring story.** The risk is that a recruiter skims past the visual work.

## 2. How homepages present projects (verified)

- **Text list, name plus one-liner.** Seen on [paco.me](https://paco.me), [emilkowal.ski](https://emilkowal.ski), [jakub.kr](https://jakub.kr) and [brianlovin.com](https://brianlovin.com). There are no images and no dates; the whole item is the link. [leerob.com](https://leerob.com) has no projects section at all: "Blogs" (title + month/year) and "Notes".
- **Text list with years.** [rauno.me/projects](https://rauno.me/projects) shows title + year, with the whole row as the link.
- **Stacked uniform media cards.** [samuelkraft.com](https://samuelkraft.com), checked by full-page screenshot:
  - A narrow single column. Each project is a 2:1-ish image or illustration on a dark ground, with a small title and a one- to two-line caption underneath, followed by a dated "Posts" list.
  - Images are `.webp` or `.png` served through `/_next/image`. No video on the homepage.
- **Thumbnail list with tags.** [brittanychiang.com](https://brittanychiang.com) shows an H3 title linking to the live project, a short description, a screenshot thumbnail, tech tags, and a badge such as "100k+ Installs".
- **Index table with filter and list/grid toggle.** [dennissnellenberg.com/work](https://dennissnellenberg.com/work), checked by screenshot: large client names in hairline-ruled rows, small uppercase column labels, filter pills, and list/grid toggle buttons. Rows on hover show a floating image preview **(unverified; the screenshot shows the resting state only)**.
- **Masonry of autoplaying clips.** [rauno.me/craft](https://rauno.me/craft), checked in the raw HTML:
  - 68 `<video playsinline loop muted autoplay src="…mp4#t=0.01">` elements, with no `poster` and no `preload` attribute.
  - The `#t=0.01` fragment forces the first frame to show.
  - A screenshot shows soft grey cards with title and date at top, and a full-width action bar at the bottom.
- **Alternating left/right feature rows and bento grids.** Common in template galleries, but none of the sites I verified uses them. I have no primary-source example to cite, so treat them as **(unverified as a pattern among well-regarded engineers)**.

## 3. What a case-study page contains

**Engineering-led.**
- [leerob.com/pixo](https://leerob.com/pixo) is an essay-style build log with section headings ("Finding the limits of coding agents", "Benchmarks and comparisons"). It includes two Mermaid architecture/flow diagrams shown as images, three demo videos, and hard numbers ("520 agents, 350M tokens, and $287", "At 159 KB, pixo is tiny", 900+ tests, 86% coverage). It links heavily to the repo, individual PRs, and benchmark docs.
- [sajidkalam.com/projects](https://sajidkalam.com/projects) says its write-ups are structured "like an engineering review: the problem, my role, the architecture, and the trade-offs — including limits and what I'd do differently". Its featured card shows Role, Period and Status. I did not open an individual case study **(section headings unverified)**.

**Visual/product-led.** [samuelkraft.com/project/trailroutes](https://samuelkraft.com/project/trailroutes):
- Title, years, and "Visit Live ↗".
- An intro paragraph and two screenshots.
- Feature sections ("Graphs and interactivity", "Trail routes for iOS"), each with an embedded video.
- "More reading" links to build blog posts.
- No problem statement and no metrics.

Craft pieces can be much lighter. [rauno.me/craft/radial-menu](https://rauno.me/craft/radial-menu) has a title, a date, a one-line instruction ("Hold and rotate from anywhere"), the demo itself, and previous/next links.

**Suggested templates for this site:**

| Engineering (Agent Tracer, AuthCore) | Visual/interactive (Event Horizon, World Observatory, Playground) | Product (GeoGuessr Academy, HumanRank) |
|---|---|---|
| One-line pitch, then a metadata rail (role, period, stack, status, repo/live links) | Hero loop or poster frame, with "Open live ↗" as the main call to action | Hero screenshot plus live link |
| Problem: 2–4 sentences | Concept: 2–3 sentences | Who it's for and what problem it solves |
| Architecture diagram (SDK → OTLP ingest → FastAPI → Postgres → SSE → dashboard) | Short clips of key moments, each with a caption | Core flow as 3–4 annotated screenshots or clips |
| 3–4 key decisions, each a decision and why, plus what you would change | "How it's built": scroll timeline, render loop, data pipeline | Key decisions (FSRS scheduling, local-first Dexie, optional Supabase auth) |
| Evidence: tests (74; 130+), CI, latency/cost figures, trace screenshot | Performance notes: frame budget, bundle size, how assets load | Outcomes, if any exist; otherwise "what I learned" |
| Links: repo, docs, demo video | Links: live, repo | Links: live, repo |

## 4. Media practices (Next.js docs and web.dev)

**Static images.**
- **Use `next/image` with static imports.** Next.js then sets width and height automatically, and `blurDataURL` "is added automatically" for jpg, png, webp and avif files ([Image component](https://nextjs.org/docs/app/api-reference/components/image)).
- **Set `sizes` for responsive or `fill` images.** Without it "the browser assumes the image will be as wide as the viewport (`100vw`)" ([same page](https://nextjs.org/docs/app/api-reference/components/image#sizes)).
- **Formats: enable `formats: ['image/avif','image/webp']`.** AVIF "generally takes 50% longer to encode but it compresses 20% smaller compared to WebP" ([formats](https://nextjs.org/docs/app/api-reference/components/image#formats)).
- **This site needs extra setup.** Under `output: 'export'`, image optimization with the default loader is unsupported; you need a custom `loaderFile` or `unoptimized` ([static exports](https://nextjs.org/docs/app/guides/static-exports)). Practical options:
  - (a) Pre-encode AVIF and WebP at build time with a script, and render `<picture>` or `unoptimized` `next/image`.
  - (b) Drop `output: "export"` on Vercel so the default optimizer works. That is the owner's decision; `vercel.json` and `netlify.toml` both exist.
- **Do not lazy-load the LCP image.** "Never lazy-load your LCP image." Use `fetchpriority="high"` on the likely LCP image, and aim for LCP ≤ 2.5 s ([web.dev optimize LCP](https://web.dev/articles/optimize-lcp)). `next/image` lazy-loads by default ([loading](https://nextjs.org/docs/app/api-reference/components/image#loading)).
- **Next.js 16 note:** `priority` was deprecated in favour of `preload`, and the docs say to use `loading="eager"` or `fetchPriority="high"` in most cases ([preload](https://nextjs.org/docs/app/api-reference/components/image#preload)). The repo is on `next@^15.1.0`, where `priority` still applies.
- **Give every image width and height** to reserve space and avoid layout shift ([web.dev lazy loading](https://web.dev/articles/browser-level-image-lazy-loading)).

**Video instead of GIF.**
- **Encode as WebM (listed first) with an MP4 fallback.** web.dev's example went from GIF 3.7 MB to MP4 551 KB to WebM 341 KB, using `<video autoplay loop muted playsinline>` ([replace GIFs with videos](https://web.dev/articles/replace-gifs-with-videos)).
- **Autoplay needs `muted` and `playsInline`.** Next.js says autoplay "it is important to also include the `muted` attribute", and `playsInline` for iOS ([Next.js videos guide](https://nextjs.org/docs/app/guides/videos)).
- **Reserve space and fill it.** Set `width`/`height` or `aspect-ratio`, and use a `poster`, especially with `preload="none"` ([same](https://nextjs.org/docs/app/guides/videos)).
- **Lazy-load clips below the fold.** web.dev says `loading="lazy"` on `<video>` defers media and poster where supported, with an IntersectionObserver fallback that adds `autoplay` when the clip enters the viewport ([lazy-loading video](https://web.dev/articles/lazy-loading-video)). Browser support for `loading` on video is **unverified here**; check caniuse before relying on it.
- **A `<video>` without a `poster` is not an LCP candidate** ([replace GIFs](https://web.dev/articles/replace-gifs-with-videos)). A poster-less loop on a case study therefore won't hurt LCP, but a poster improves perceived load.
- **Size guidance.** Neither source gives a hard size target. As a working budget, aim for 6–10 s loops under ~1 MB, at the size actually displayed (≤1280px wide for this 48rem column) **(own rule of thumb, unverified)**.
- **Hosting.** Self-host in `/public` or on Vercel Blob for full control; use YouTube/Vimeo iframes only for long demos ([Next.js videos](https://nextjs.org/docs/app/guides/videos)).
- **Motion preferences.** Per this repo's `CLAUDE.md`, loops always play; do not add reduced-motion checks.

## 5. Presenting projects without a UI (AuthCore, the Agent Tracer SDK)

- **Architecture diagram as the hero image.** [leerob.com/pixo](https://leerob.com/pixo) uses Mermaid architecture and flow diagrams as its main visuals. GitHub renders Mermaid natively in a `mermaid` fenced block ([GitHub docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)), so one diagram source can serve both the README and the site. On the site, draw it as inline SVG in paper/ink tokens rather than a Mermaid screenshot, so it matches both themes.
- **Hard numbers and process links.** Pixo uses test counts, coverage, binary size and PR links ([leerob.com/pixo](https://leerob.com/pixo)). AuthCore already has "29 endpoints", "130+ pytest tests" and "refresh token rotation with reuse-family revocation" (`src/data/portfolio.ts`).
- **Request and response traces (own suggestion; no portfolio example verified).**
  - For AuthCore: a short annotated sequence such as `POST /auth/login → 200 {access, refresh}` → `POST /auth/refresh` (reused token) `→ 401 family revoked`, set in Geist Mono. It shows the security design in about six lines.
  - For Agent Tracer: a code snippet of the SDK decorator next to the waterfall it produces.
- **Terminal recordings** (asciinema or a looping MP4 of `pytest`, `docker compose up`) are a cheap way to add motion. No portfolio example was verified.

---

## Candidate directions

### A. Ledger index + case studies
- **Concept:** Keep the current editorial list, but make it a compact index that points to deep pages.
- **IA:** `/` (index of all 6–7 projects) → `/projects/[slug]`.
- **Homepage:**
  - One hairline-ruled row per project: name / category / year / a mono stack summary, with the existing `studio-grid` metadata column.
  - On hover or focus (desktop), a small poster frame appears; mobile shows none.
  - The whole row links to the case study. The current highlights and `<details>` move to the case study.
- **Case study:** One template with engineering and visual variants (§3).
- **References:** [rauno.me/projects](https://rauno.me/projects), [dennissnellenberg.com/work](https://dennissnellenberg.com/work), [brittanychiang.com/archive](https://brittanychiang.com/archive).
- **Trade-offs:**
  - Most restrained, and the fastest for a recruiter to scan.
  - The visual work is invisible until someone hovers or clicks.
  - Hover previews don't exist on touch screens.
- **Fit with the current aesthetic:** Highest; it is an evolution of today's component.
- **Build cost:** Low to medium. One component and one dynamic route with `generateStaticParams` (required under static export, per [static exports](https://nextjs.org/docs/app/guides/static-exports)), plus 7 poster images.

### B. Media column (Samuel Kraft model)
- **Concept:** Every project gets a uniform media frame (16:10) with a short caption, stacked in the 48rem column.
- **IA:** `/` → `/projects/[slug]`.
- **Homepage:**
  - Frames for the visual projects play a muted loop clip once in view.
  - Engineering projects get a designed frame instead: the Agent Tracer waterfall screenshot, or an AuthCore token-rotation diagram drawn in ink on paper.
  - Below each frame: name, a one-line description, and mono category · year.
- **Case study:** Media-forward. The frame expands into a hero.
- **References:** [samuelkraft.com](https://samuelkraft.com), [samuelkraft.com/project/trailroutes](https://samuelkraft.com/project/trailroutes).
- **Trade-offs:**
  - Shows design craft immediately, and all projects are treated equally.
  - Pages get long: 7 frames of about 450px each.
  - Requires 7 high-quality assets.
  - Backend projects risk looking weaker next to three.js clips unless their frames are designed carefully.
- **Fit with the current aesthetic:** Good, if the frames use the neutral-100 ground and hairline borders rather than dark cards.
- **Build cost:** Medium to high, mostly asset production (capture, encode WebM/MP4/AVIF, posters).

### C. Work + Lab split
- **Concept:** Separate hiring evidence from craft.
- **IA:**
  - `/` features "Selected work" (Agent Tracer, World Observatory, GeoGuessr Academy, HumanRank) → `/projects/[slug]`.
  - A "Lab" section, or `/lab`, holds Event Horizon, Interaction Playground, and optionally AuthCore as "systems".
- **Homepage:**
  - Selected work uses rich rows: the metadata rail on the left, the text and a single media frame on the right.
  - Lab uses a compact 2–3-column grid of short looping clips with title and date, linking to the live site.
- **Case study:** Full case studies for Selected work only. Lab items get a one-screen page or link out.
- **References:** [rauno.me/craft](https://rauno.me/craft), [paco.me/craft](https://paco.me/craft), [rauno.me/craft/radial-menu](https://rauno.me/craft/radial-menu).
- **Trade-offs:**
  - Gives the clearest story for full-stack and AI roles, and keeps the homepage short.
  - Calling Event Horizon "lab" may undersell it.
  - Two visual systems to keep consistent.
- **Fit with the current aesthetic:** Good. The lab grid can borrow Rauno's soft grey cards, which are close to `neutral-100`.
- **Build cost:** Medium. Two components, one case-study route, and about 4 full case studies plus 2–3 light pages.

### D. Featured trio + archive table
- **Concept:** Rank by importance, not by type.
- **IA:** `/` (3 featured projects) → `/projects/[slug]`; `/projects` holds a full table of all projects with links.
- **Homepage:**
  - Three large feature blocks: poster or loop, one-line pitch, two proof points (for example "74 tests · live SSE timelines"), and a "Read case study →" link using `.link-arrow`.
  - Below them: "All projects →".
- **Case study:** As in §3. The archive table shows Year / Project / Kind / Built with / Links, as on [brittanychiang.com/archive](https://brittanychiang.com/archive).
- **References:** [brittanychiang.com](https://brittanychiang.com), [sajidkalam.com/projects](https://sajidkalam.com/projects).
- **Trade-offs:**
  - The most conventional recruiter-friendly pattern, and the clearest hierarchy.
  - A table of only 7 rows can feel thin.
  - Requires choosing favourites.
- **Fit with the current aesthetic:** High. The table maps directly onto the mono labels and hairlines.
- **Build cost:** Medium. Three rich blocks, a table page, and case studies for at least the featured three.

## Recommendation

**Prototype A and C first. They bracket the decision.**
- A is the most restrained version and keeps everything in one list.
- C is the version that makes craft most visible, separated from the hiring story.
- If the owner wants a middle ground, borrow D's "two proof points" line for A's rows.
- Build the `/projects/[slug]` template once. A, C and D all need it, and it matters more to an engineering manager than the homepage treatment does.

## Open decisions for the owner

1. **AuthCore:** include it as a diagram-led case study, put it in the archive or lab only, or drop it?
2. **Featured set:** which 3–4 projects best match full-stack and AI roles? Agent Tracer seems certain.
3. **Static export:** keep `output: "export"` (pre-encode images yourself) or drop it to use the Vercel image optimizer?
4. **Media budget:** will you capture and encode about 7 loops and posters, or use static screenshots for v1?
5. **Event Horizon:** featured work or lab?
6. **Case-study depth:** full write-ups for all projects, or only the featured ones, with the rest linking out?
