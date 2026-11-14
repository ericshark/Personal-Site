---
title: Projects redesign — compact ledger + dashboard case studies
status: ready-for-agent
created: 2026-11-13
research: docs/research/portfolio-projects-presentation.md
---

# Projects redesign: compact ledger + dashboard case studies

## Problem Statement

The portfolio's Projects section shows only two projects (Agent Tracer and AuthCore). Each is a long text block with a "Technical details" disclosure and no images. Since then the owner has shipped five more projects, mostly visual or interactive: a three.js scroll journey, a map-based data dashboard, a learning app, a games arcade, and a set of motion studies. None of them are on the site.

Adding all seven inline would overload the homepage and force the owner to cut the detail that makes the work look professional. The current layout also has no place for architecture, design decisions or evidence, which are what an engineering manager looks for. On top of that, the page as a whole feels slightly too spacious, which makes it read as less polished than it is.

## Solution

**The homepage Projects section becomes a compact ledger: one tight, ruled row per project.** Each row has:

- a small inline screenshot
- name, one-liner, stack, category and year
- three explicit actions: **Live**, **GitHub** and **Case study**

There is no hover preview; the image is always visible in the row. A visitor can scroll all seven projects in about one screen.

**Each project gets its own case-study page at `/projects/<slug>`.**

- The page is wider than the homepage column and laid out like a dashboard.
- On a desktop screen it shows nearly everything worth knowing in one view: summary, media, facts, metrics, architecture, key decisions and links.
- It is dense and scannable rather than a long essay. It replaces the long, airy Agent Tracer prototype page.

**The whole homepage gets a restrained density pass, done with the `frontend-design` skill.**

- Tighter vertical rhythm and section spacing, so it reads as more professional.
- The existing identity stays: Geist, paper/ink tokens, mono labels, hairlines, motion.

## User Stories

### Recruiter / hiring manager scanning the homepage

1. As a recruiter, I want to see all of Eric's projects in one compact list, so that I can grasp the breadth of his work without scrolling through long blocks.
2. As a recruiter, I want each project to show a small screenshot inline, so that I can tell at a glance what each thing looks like without hovering.
3. As a recruiter, I want a one-sentence description per project, so that I understand what it does in seconds.
4. As a recruiter, I want to see each project's category and year, so that I can judge recency and relevance to the role.
5. As an engineering manager, I want the tech stack on every row, so that I can match projects to the role's stack.
6. As an engineering manager, I want the AI and backend projects listed first, so that the most role-relevant work is what I see first.
7. As a visitor, I want three clearly labelled actions on each row (Live, GitHub, Case study), so that I can choose how deep to go.
8. As a visitor, I want the Live and GitHub links to open in a new tab, so that I don't lose my place on the portfolio.
9. As a visitor, I want projects without a live deployment (AuthCore) to simply not show a Live action, so that I never hit a dead link.
10. As a visitor, I want every GitHub link to open a public repository, so that I never land on a 404.
11. As a mobile visitor, I want the rows to stay compact, with the image beside the text and the actions reachable, so that the list is easy to scroll on a phone.
12. As a keyboard user, I want each action in a row to be focusable with a visible focus ring, so that I can navigate without a mouse.
13. As a screen-reader user, I want each action's accessible name to include the project name (for example "Agent Tracer on GitHub"), so that the links make sense out of context.
14. As a screen-reader user, I want screenshots to have meaningful alt text, and the designed visuals to have a text description, so that I don't miss what they show.

### Visitor reading a case study

15. As an engineering manager, I want a project page that fits the essentials into roughly one desktop screen, so that I can evaluate a project in under a minute.
16. As an engineering manager, I want a fact sheet (role, year, status, stack, links), so that I get the key facts without reading prose.
17. As an engineering manager, I want headline metrics (tests, endpoints, scale numbers) shown as tiles, so that I can see evidence of rigour at a glance.
18. As an engineering manager, I want a compact architecture diagram for backend-heavy projects, so that I understand the system design quickly.
19. As an engineering manager, I want 3–4 key decisions, each a one-line title plus a short why, so that I can judge Eric's engineering judgement.
20. As a design-minded reviewer, I want a large screenshot (or designed visual) on each project page, so that I can see the craft.
21. As a visitor, I want the same Live / GitHub actions on the project page, prominent near the top, so that I can try the project straight away.
22. As a visitor, I want the project page to use a wider canvas than the homepage, so that it feels like a premium, information-rich overview rather than a blog post.
23. As a visitor, I want a back link to the homepage's Projects section, so that I return to where I was.
24. As a visitor, I want previous/next project navigation on each project page, so that I can browse case studies without going back to the list.
25. As a visitor, I want the theme toggle on project pages too, so that my light/dark choice stays consistent across the site.
26. As a mobile visitor, I want the dashboard panels to stack in a sensible reading order (summary → media → facts → metrics → architecture → decisions), so that the page still reads well on a phone.
27. As a visitor, I want project pages to load fast, with the main image prioritised and nothing shifting as it loads, so that the site feels polished.
28. As a visitor who shares a link, I want each project page to have its own title and description in search results and link previews, so that shared links are clear.

### Visitor experiencing the whole page

29. As a visitor, I want the homepage to feel tighter and more deliberate, without oversized gaps between sections, so that it reads as professional and finished.
30. As a returning visitor, I want the site's existing look and animations preserved, so that the polish feels like a refinement, not a redesign.
31. As a visitor in dark mode, I want every new element (thumbnails, panels, diagrams, metric tiles) to look right in dark, so that nothing looks broken.

### Owner (Eric) maintaining the site

32. As the owner, I want all project content in the one data module, so that I can add or edit a project without touching components.
33. As the owner, I want a project's GitHub, Live and case-study fields to be optional, with actions shown only when present, so that the data stays truthful.
34. As the owner, I want a repeatable script that captures and encodes project screenshots, so that I can refresh images when a project changes.
35. As the owner, I want case-study sections (architecture, decisions, metrics, gallery) to be optional per project, so that a visual piece doesn't need a fake architecture diagram.
36. As the owner, I want the prototype routes removed from the production site but preserved on a branch, so that main stays clean and the explorations aren't lost.
37. As the owner, I want automated tests that catch missing images, broken internal links, missing case-study pages and horizontal overflow, so that adding projects can't silently break the site.

## Implementation Decisions

### Project list and order

Seven projects appear, in this order: Agent Tracer, AuthCore, World Observatory, GeoPractice, HumanRank, Event Horizon, Interface Explorations.

### Links (verified 2026-11-13 via the Vercel CLI and `gh`)

| Project                | Live                                                                                                                     | GitHub (to be made public where noted)                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Agent Tracer           | https://agent-tracer-seven.vercel.app                                                                                    | https://github.com/ericshark/agent-tracer (public)                          |
| AuthCore               | none (no deployment)                                                                                                     | https://github.com/ericshark/authentication-authorization-api (public)      |
| World Observatory      | https://world-observatory.ericzwierzynski.dev (custom domain; the Vercel production URL is world-observatory.vercel.app) | https://github.com/ericshark/world-observatory (private → make public)      |
| GeoPractice            | https://geo-guesser-practice.vercel.app                                                                                  | https://github.com/ericshark/geo-guesser-practice (private → make public)   |
| HumanRank              | https://human-benchmark-orcin.vercel.app                                                                                 | https://github.com/ericshark/human-benchmark (private → make public)        |
| Event Horizon          | https://event-horizon-six-lake.vercel.app                                                                                | https://github.com/ericshark/event-horizon (private → make public)          |
| Interface Explorations | https://interaction-playground-swart.vercel.app (Vercel lists it as the production URL, status Ready)                    | https://github.com/ericshark/interaction-playground (private → make public) |

- **Owner decision:** all five private repos will be made public, so every project shows a GitHub link. This is an owner prerequisite before launch (see Further Notes).
- **The links table is the source of truth for v1 URLs.** A later, separately approved step may move projects to `<name>.ericzwierzynski.dev` subdomains. That would be a data-only change.

### Data model (portfolio data module)

- The existing `Project` type is replaced with a richer type. All content stays in the single data module, and components render only from it.
- The decision-rich shape, refined from the prototype:

  ```ts
  type Project = {
    slug: string;                 // URL segment for /projects/<slug>, unique
    name: string;
    oneLiner: string;             // one sentence, homepage row + page subtitle
    category: string;             // e.g. "AI agent observability"
    kind: "Engineering" | "Product" | "Visual";
    year: string;
    stack: string[];
    media: { type: "image"; src: string; alt: string } // pre-encoded screenshot
         | { type: "trace" | "auth" };                 // designed, theme-aware visual
    live?: string;                // omit when not deployed → no Live action
    repo?: string;                // omit if not public → no GitHub action
    caseStudy: {
      summary: string;            // 2–3 sentences: problem + what it does
      role: string;               // e.g. "Solo — design & build" (owner-confirmed)
      status?: string;            // optional, e.g. "Live", "Ongoing"
      metrics: { value: string; label: string }[];     // 2–4 tiles
      decisions: { title: string; body: string }[];    // 0–4
      architecture?: { nodes: …; edges: … } | "trace" | "auth"; // optional diagram
      gallery?: { src: string; alt: string; caption?: string }[]; // optional
    };
  };
  ```

- **Every project has a case study**, so the Case study action is always present.
- **Live and GitHub actions render only when their field is present.** Never invent links.
- **Unused fields are removed.** The old `highlights`, `details` and `date` fields go away, and their content moves into the case-study fields. Agent Tracer's and AuthCore's existing `details` bullets are the source for their decisions and metrics.

### Homepage: compact ledger

- **Replaces the current Projects component.** The section heading stays "01 Projects", and the `#projects` anchor and header nav keep working.
- **Row layout, desktop:** a ruled row with a fixed-width inline thumbnail (16:10, roughly 10–12rem wide, hairline border, rounded), then name, one-liner and mono stack line in the middle, then category · year in mono.
- **Actions:** sit on one line under the text: `Live ↗`, `GitHub ↗`, `Case study →`. They reuse the existing `.action-quiet` / `.link-arrow` styles, and Case study is the primary (ink) action.
- **Row layout, mobile:** stays horizontal and compact, with a smaller thumbnail (about 6–7rem) beside the name and one-liner. Stack and meta sit below, and actions wrap onto one line.
- **No hover image preview.** No cursor-following element. Rows are not a single big link, which avoids nested interactive elements; the three actions are the only links.
- **Thumbnails do not show the case-study preview.** They may link to the case study as a convenience, but they are not focusable separately (`tabindex=-1`, `aria-hidden` link wrapper or none), so keyboard order stays Live → GitHub → Case study.
- **Remove the "Technical details" disclosure from Projects.** That content now lives on the case-study pages.
- **Target:** all seven rows fit in about one desktop viewport plus a little, roughly 110–130px per row on desktop.
- **Keep the Reveal animation on rows**, staggered lightly. Per project rules, never add reduced-motion checks.

### Case-study page: dashboard layout

- **Route:** `/projects/<slug>`, statically generated for every project (static export is kept). Unknown slugs fall through to the existing 404.
- **Width:** wider than the homepage column, about 72rem max (versus the site's 48rem). It uses the same paper/ink tokens, Geist and mono labels, so it reads as the same site.
- **Header bar:**
  - Back link to `/#projects` ("All projects").
  - Previous/next project links.
  - Theme toggle.
  - Optionally the owner's name linking home.
- **Top band:** a mono kicker (category · year), the name as `h1`, the one-liner/summary, and the Live / GitHub actions as prominent buttons.
- **Dashboard grid on desktop:** a 12-column grid of hairline-bordered panels on the neutral-100 ground, with these panels:
  - **Media panel:** the large screenshot or designed visual. Spans most of the width on the first row.
  - **Fact sheet:** role, year, status, stack, links. A narrow column next to the media.
  - **Metrics:** 2–4 tiles, each a large value plus a mono label.
  - **Architecture:** a compact diagram, only when present.
  - **Key decisions:** a 2×2 grid of short cards, each a title plus 1–2 sentences.
  - **Gallery:** optional extra screenshots, only when present.
- **One-screen goal:** at 1440×900, the top band, media, fact sheet and metrics fit above the fold. Architecture and decisions fit within about one more screen. No long prose sections and no "What I'd change" essay.
- **Mobile:** panels stack in this order: summary → media → facts → metrics → architecture → decisions → gallery.
- **Theme-aware visuals:** the Agent Tracer and AuthCore visuals are code-drawn and follow the theme tokens, carried over from the prototype's trace waterfall and token-rotation sequence. They stand in for screenshots, since Agent Tracer's live UI is behind a login and AuthCore has no UI.
- **Metadata:** each page sets its own title and description from the project data. The sitemap includes every `/projects/<slug>`.

### Media pipeline

- **Static export stays** (owner decision).
- **Screenshots** come from the live deployments at 1440×900 and are pre-encoded to AVIF and WebP at the two display sizes: homepage thumbnail and case-study media.
- **A small, repeatable capture-and-encode script** is added to the repo for the owner to re-run. It uses headless Playwright and an image encoder.
- **Images render with explicit width and height:**
  - The case-study media image loads eagerly with high fetch priority.
  - Homepage thumbnails lazy-load.
- **The committed prototype JPEGs** (the screenshots in the public projects folder) are the source material until the script replaces them.

### Whole-page density polish

- **Run with the `frontend-design` skill**, scoped to refinement. The current identity, copy and motion are preserved.
- **Direction:** reduce vertical whitespace by about 20–30% across the Hero, section padding, heading-to-content gaps, and the spacing between Experience and Education entries. Tighten mono label sizes and line lengths where they look loose.
- **Section headings and the numbered index system stay**, but less gap separates them from content.
- **The Footer/Contact and Header** get the same rhythm pass. No new sections, no new colours, no new fonts.
- **Applies to both themes and to mobile.** Re-verify there is no horizontal scroll at 360–390px.

### Prototype disposal

- **Remove the throwaway prototype routes and components:** the `/lab/[variant]` route, the prototype case-study route, the prototype component folder and the floating switcher.
- **Before removing them,** commit them to a separate throwaway branch (e.g. `prototype/projects-directions`) so the explorations stay referenceable.
- **Verdict to record in the commit message:** A (Ledger) won, with an inline image instead of a hover preview. B was rejected (too long and busy). C's rich rows were rejected, but its explicit action set and case-study link were adopted.

## Testing Decisions

- **One seam:** the existing Playwright suite that runs against the built static export (`npm run build` then serve `out/`). No new test framework; no unit tests of component internals.
- **A good test exercises what a visitor sees and can do:** headings, links, images, navigation and theme. It does not check class names, DOM structure or spacing values.
- **New and updated tests:**
  - **Homepage Projects:** exactly one entry per project in the data, in the data's order. Each entry has a visible image (an `img` with non-empty alt, or the designed visual's labelled container). Each has a Case study link to `/projects/<slug>`, plus a Live link and a GitHub link exactly when the data provides them. Every external link has `target="_blank"` and `rel="noopener noreferrer"` (the existing test covers this generally).
  - **Project pages:** every project slug renders a page with the project name as `h1`, a working back link to `/#projects`, and working previous/next links, with no console errors.
  - **Internal links:** every internal `href` on the homepage and all project pages resolves to a 200 in the static build.
  - **Theme:** the toggle works on a project page, and the saved choice persists between the homepage and a project page.
  - **Responsive:** no horizontal overflow at 390px on the homepage or any project page.
  - **404:** an unknown project slug shows the existing 404 page.
- **The existing smoke tests keep passing.** "Technical details disclosures open" still has a target in Experience.
- **External link reachability** (Vercel and GitHub returning 200) is not part of CI, because it needs the network and depends on repo visibility. It is a one-off pre-launch check: curl each Live and GitHub URL, expecting 200.
- **Prior art:** `tests/smoke.spec.ts` (console-error collection, heading checks, theme persistence, external-link rel checks, 404 flow). Run headless with `PW_HEADLESS=true npm test`.

## Out of Scope

- Moving projects to `*.ericzwierzynski.dev` subdomains, and any DNS or deployment changes. Separate step, approved later.
- Looping video clips or GIFs for projects. Static screenshots only for v1.
- Fixing Agent Tracer's live demo login, which currently hangs on the demo account. That belongs in the agent-tracer repo, though it should be fixed before launch (see Further Notes).
- Making the five private repos public. The owner does this, as a prerequisite.
- New homepage sections, copy rewrites of the Hero/About/Experience, a blog, or a separate `/projects` index page.
- Any reduced-motion handling. Animations always play, per project rules.
- Replacing the static export with server-side image optimisation.

## Further Notes

- **Pre-launch prerequisites (owner):**
  1. Before making each of the five private repos public, scan it for committed secrets (`.env` files, keys in history) and confirm its README is presentable.
  2. Fix or warm Agent Tracer's demo backend so "Live" doesn't hang at sign-in. Otherwise consider surfacing the demo credentials on the case-study page.
  3. Confirm "Role" for each project. The prototype assumed "Solo — design & build".
  4. Review all drafted case-study copy for accuracy.
- **Display names to confirm:** "GeoPractice" (the live app's brand; its README says "GeoGuessr Academy") and "Interface Explorations" (the live title; the repo is `interaction-playground`). The spec uses the live names.
- **Case-study copy is drafted from each repo's README and docs.** Numbers already established:
  - Agent Tracer: 74 tests on SQLite + PostgreSQL; OTLP/HTTP ingest; SSE; 256-bit share links.
  - AuthCore: 29 endpoints, 130+ tests.
  - World Observatory: 217 countries, 13 signals.
  - GeoPractice: 543 skills, FSRS scheduling.
  - HumanRank: 12 games, 6 skills.
  - Event Horizon: 21 checkpoints.
  - Interface Explorations: 16 studies, 3 collections.
- **Interaction Playground deploy status:** the Vercel dashboard card showed "No Production Deployment", but the CLI reports a Ready production deployment at the swart URL. Re-check before launch.
- **Research and direction rationale:** `docs/research/portfolio-projects-presentation.md`.
