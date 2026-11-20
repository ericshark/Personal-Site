---
title: "Ticket 2 — Playground theme"
status: done
created: 2026-11-19
depends-on: 01-theme-foundation-menu-observatory.md
read-first: docs/tickets/site-themes/README.md
---

# Ticket 2: Playground theme

## Goal

Add a **Playground** entry to the theme menu. It restyles the homepage and every case-study page in the spirit of Interaction Playground (Interface Explorations):

- a white page with a dashed-border content column;
- ASCII jellyfish swimming in the margins;
- an editorial serif with a pixel-mono label font;
- the **Matrix** demo's glyph-decode and glitch language for how content appears.

It also adds a **3D gallery carousel of project screenshots** above the project list.

When this ticket is done, the owner can run `npm run dev`, pick Playground from the menu, and see all of this.

Read `README.md` in this folder first. Use the theme system from ticket 1 (registry, `data-ui` hooks, `ThemeLayer`, `ThemeSlot`, `revealPreset`, `headline`, `src/themes/fonts.ts`). Do not fork the shared components.

**Source project:** `~/GitHub/design/interaction-playground`

- `src/styles.css`: tokens at the top, `main` column at about line 179, `.jellyfish-background`, carousel CSS at about lines 1793–1890.
- `src/components/JellyfishBackground.tsx`
- `src/demos/graphics.tsx`: `Matrix`, `rainGlyphs`, the glitch and chromatic-split code at about lines 346–540.
- `src/demos/galleries.tsx`: `RingCard` and `GalleryCarousel` at about lines 455–620.
- `src/core.tsx`: `RollingText`, `IconButton`, the spring `snappy`.

## Registry entry

| id           | label      | description                             | scheme | themeColor |
| ------------ | ---------- | --------------------------------------- | ------ | ---------- |
| `playground` | Playground | Interface studies, jellyfish and glyphs | light  | `#ffffff`  |

Menu position: after Observatory.

## Fonts

Do **not** copy Die Grotesk or STK Bureau Serif (see the README's font licensing section). Use:

- **Display:** `Newsreader` via `next/font/google`, weights 400–600, `preload: false`. Stand-in for Bureau Serif. Use optical sizing; headings sit at weight 500.
- **Body:** `Schibsted_Grotesk` via `next/font/google`, `preload: false`. Stand-in for Die Grotesk.
- **Labels:** **Departure Mono**, OFL.
  - Download `DepartureMono-Regular.woff2` from the official release (https://github.com/rektdeckard/departure-mono, latest release). Commit it with its `OFL.txt` to `src/themes/playground/fonts/`.
  - Load it with `next/font/local`, `preload: false`.
  - It is a pixel font, designed for multiples of 11 px, so use 11 px for labels and 22 px for anything larger.

```
--font-display: var(--font-newsreader);
--font-body: var(--font-schibsted);
--font-label: var(--font-departure);
```

## Tokens

```
--color-paper: 255 255 255;
--color-ink: 23 25 30;          /* #17191e */
--color-accent: 111 124 242;    /* #6f7cf2 */
--color-accent-2: 255 40 110;   /* glitch pink, used only in effects */
--color-signal: 111 124 242;
--color-neutral-100: 246 246 248; /* #f6f6f8 surface-2 */
--color-neutral-200: 233 233 235; /* #e9e9eb line */
--color-neutral-300: 212 212 218; /* #d4d4da line-strong */
--color-neutral-400: 146 147 151; /* #929397 muted (decorative only) */
--color-neutral-500: 110 111 118; /* darkened from the source so 11px labels pass 4.5:1 */
--color-neutral-600: 93 94 102;   /* #5d5e66 text-2 */
--color-neutral-700: 58 59 66;
--radius-panel: 12px;
--panel-shadow: 0 1px 2px #1b1b2305, 0 3px 8px #1b1b2305;
```

Text set in `neutral-400` must meet 4.5:1 or be decorative. Where it fails, as with the project group labels, raise that element to `neutral-500` in this theme.

## Layout treatment: "the strip"

This is Interaction Playground's signature. The content column is an opaque white strip with dashed side borders, and the jellyfish swim in the margins on either side.

- **`body`:** white, with the jellyfish canvas fixed behind everything at `z-index: 0`.
- **Every `data-ui="column"`** gets `background: rgb(var(--color-paper))`, `border-inline: 1px dashed rgb(var(--color-neutral-200))`, `position: relative`, `z-index: 1`.
  - The columns stack into one continuous strip from header to footer. Remove any vertical gaps between header, main and footer columns, so the dashed lines run unbroken.
  - Pad the columns horizontally as the site does today. The source uses 31 px; keep the current `px-6 sm:px-8`.
- **`site-header`:** the outer bar is transparent, so jellyfish pass behind it. Only its column is white.
  - When scrolled, the column gets `bg-paper/90`, backdrop blur, and the dashed bottom border.
- **Case-study page:** its column is `max-w-6xl`, so on 1440 px screens the jellyfish margins are narrower. That is expected.

## Background: jellyfish (`ThemeLayer` Background)

- Port `JellyfishBackground.tsx` to `src/themes/playground/JellyfishBackground.tsx`. Keep its behaviour:
  - three jellyfish;
  - glyph bells and tentacles;
  - 30 fps cap;
  - desktop only via `(min-width: 1024px)`;
  - pauses while the tab is hidden;
  - device pixel ratio capped at 2.
- Remove the `usePreferences` dependency and always use the **light** palette (`#b5b8bc`, `#979ca2`, `#767e86`, `#59636d`).
- **Canvas font:** the source sets `7px monospace`. Use `7px "Departure Mono", monospace` only if it reads well; otherwise keep the monospace.
- The canvas is `aria-hidden` and `pointer-events: none`.

## Type and surfaces

- **`hero-headline`:** Newsreader 500, about 2.75rem on desktop, `tracking -0.01em`, `ink`.
- **`hero-kicker`:** Departure Mono 11 px, uppercase, `neutral-500`.
- **`hero-note`:** a soft card, matching the source's `.panel` look: `bg-neutral-100`, 12 px radius, `--panel-shadow`, no hard border.
- **`section-heading`:**
  - The rule becomes a dashed line (`neutral-200`).
  - **`section-index`:** Departure Mono 11 px with a leading `§`, `::before { content: "§ " }`.
  - **`section-title`:** Newsreader 500, 1.75rem.
- **`nav-pill`:** the source's `Choices` pill, `bg-neutral-100`, `ink` text, a 999 px radius and `--panel-shadow`. It is not an ink-filled pill. Nav labels are Departure Mono 11 px.
- **`project-row`:** a card per row, with 8 px gaps between rows instead of hairlines.
  - `bg-paper`, 1 px `neutral-200` border, 12 px radius, `--panel-shadow`.
  - **Hover:** `translateY(-1px)`, a stronger shadow, and the thumbnail glitch (see Motion).
- **`project-thumb`:** 8 px radius, with an inset 1 px highlight as in the source's `.ring-card:after`.
- **`project-name`:** Newsreader 500, 1.25rem.
- **`project-meta` and stack line:** Departure Mono 11 px.
- **`project-actions`:**
  - Departure Mono 11 px, uppercase. "Case study" is a small filled pill (`bg-ink text-paper`, rounded-full); Live and GitHub are plain.
  - **Hover roll-over:** each label rolls over character by character in the `RollingText` style.
    - Build it in CSS, scoped to Playground. The label holds two stacked copies of its text, split into per-character spans.
    - On hover, each character of the first copy slides up out of a clipped line box, and the matching character of the second copy slides in from below. Stagger the characters by 15 ms each, 250 ms per character, with `--ease-soft`.
    - The second copy is `aria-hidden`. The action's accessible name stays unchanged.
    - Render the split markup through a small client wrapper only while Playground is active. Other themes get the plain label.
  - Port `RollingText` itself to `src/themes/playground/RollingText.tsx`. The carousel counter uses it.
- **`link-preview`:** the soft card treatment, with Departure Mono for the URL.
- **`entry`:** period in Departure Mono, role in Newsreader. The disclosure summary is a pill button.
- **`contact`:** the headline is Newsreader 500, about 2rem. The email link draws its underline in from the left, as it does today, but in the accent color.
- **`colophon`:** Departure Mono.
- **Selection color:** `accent` background, white text.

## Case-study page

- **`cs-title`:** Newsreader 500, 2.75rem.
- **`cs-actions`:** filled ink pill for Live, outlined pill for GitHub.
- **`cs-media`:** 12 px radius with `--panel-shadow` on a `neutral-100` mat (8 px padding).
- **`panel`:** soft cards (`bg-neutral-100`, 12 px radius, no border). Panel labels are Departure Mono 11 px, uppercase.
- **`cs-metric`:** the value is Newsreader 500 at 2rem and the label is Departure Mono. The tile is a white card with `--panel-shadow`.
- **`cs-decision`:** white cards with dashed `neutral-200` borders.

## Motion: decode and glitch (from the Matrix demo)

### Text decode (`src/themes/playground/DecodeText.tsx`)

- **How it renders:** the real text sits in an `sr-only` span. The visible copy is `aria-hidden` and split into per-character spans.
  - Each character's slot is held at **the width of its final character**. Render the final character with `visibility: hidden` and overlay the scrambled glyph with `position: absolute`. This keeps proportional fonts from causing layout jitter.
- **Timing:**
  - Each character cycles through random glyphs from `rainGlyphs` (`'CODE<>=+*-'`) every 40 ms, then locks to its final character.
  - Lock times sweep left to right over 500–700 ms in total, with ±60 ms random jitter per character.
  - Scrambled glyphs render in `neutral-500` and turn `ink` as they lock.
- **Where it's used:**
  - As Playground's `headline` effect, for the hero `h1`.
  - Through Playground's `revealPreset` for `section-title`, `project-name`, `project-group-label`, `cs-title` and panel labels.
  - When those elements are revealed, the reveal runs DecodeText.
- **Reveal hook:** extend ticket 1's preset API if needed, so a preset can supply a text effect for elements with those hooks. Paragraphs never decode; they use the block reveal below.

### Block reveal preset

- **`revealPreset`:** opacity steps in rather than easing. Use `steps(4)`-like keyframes `[0, 0.4, 0.4, 1]` over 0.35 s, with `y` 8 → 0 px. There is no blur.

### ASCII dissolve for thumbnails (`project-thumb`, `cs-media`)

- On reveal, a canvas overlay covers the image with a grid of glyphs drawn from `rainGlyphs`:
  - cells about 11 px;
  - glyphs in `ink` at 60% on `bg-paper`.
- The cells clear in random order over about 600 ms, revealing the image.
- In the first 120 ms, draw the source's **chromatic split**: two tinted copies offset ±6 px horizontally, pink `rgba(255,40,110,.45)` and cyan `rgba(0,190,255,.45)`.
- Remove the canvas when the effect finishes.

### Hover glitch on project rows

- On `pointerenter`, the thumbnail plays a 300 ms glitch:
  - 3–5 horizontal slices shift by up to ±12 px;
  - plus the pink and cyan split.
- Use CSS `clip-path` slices on two pseudo-layers, or the canvas approach above.
- Throttle it to once per 350 ms per row, as the source's sound throttle does.

### Enter effect on switching into Playground

Every `section-title` and `project-name` currently in the viewport decodes once.

## Gallery carousel (`ThemeSlot name="projects-intro"`)

Add the `projects-intro` slot to `Projects.tsx`, between `SectionHeading` and the first project group. It renders nothing in other themes.

**Data.** `Projects.tsx`, a server component, passes slot data built from `projects`: every project with `media.type === "image"` (currently 8), mapped to `{ slug, name, category, src: media.src, alt: media.alt }`. The slot component must not import the data module.

**Port `GalleryCarousel` and `RingCard`** to `src/themes/playground/ProjectCarousel.tsx`, with these changes:

- **Cards:** landscape 16:10 screenshots instead of portrait photos.
  - Card size 200×125 px, radius about 300 px (`--ring-radius`), ring step `360 / count`.
  - Tilt `rotateX(-7deg)`, perspective 1100 px. The viewport height is about 340 px, plus about 56 px for the controls.
- **Images:** use the `-thumb` AVIF/WebP pair (480×300) through the existing `Screenshot` component, or the same `<picture>` markup, lazy-loaded.
- **Kept from the source:**
  - auto-rotate at 8°/s, easing to a stop on hover or during a drag;
  - drag to spin, with velocity projection and a spring snap (`stiffness 110, damping 20`);
  - a click-suppress after drags;
  - opacity by facing angle (`[-1,0,1] → [0.16,0.55,1]`);
  - a floor shadow (`.ring-floor`).
- **Card clicks:**
  - Clicking a side card rotates it to the front.
  - **Clicking the front card navigates to `/projects/<slug>`.** The front card is a link; the others are buttons.
- **Controls row:**
  - previous and next icon buttons (lucide `ChevronLeft` and `ChevronRight`, labelled "Previous project" and "Next project");
  - the front project's name with DecodeText on change;
  - a `RollingText` counter, `03 / 08`, in Departure Mono;
  - the category in `neutral-500`.
- **Accessibility:**
  - The carousel is a `section` with `aria-label="Project gallery"` and `aria-roledescription="carousel"`.
  - Side cards are buttons with `aria-label="Show <name>"`. The front card is a link with `aria-label="Open <name> case study"`.
  - ArrowLeft and ArrowRight rotate the carousel when it has focus.
  - The project list below stays the canonical, complete navigation.
- **Mobile minimum (under 768 px):** card 140×88 and radius 190 px. It must not cause horizontal overflow, so clip it with `overflow: hidden` on the carousel.
- **Reveal:** the ring fades in and spins up from 0 when it scrolls into view.

## Tests

The theme loop from ticket 1 covers the basics automatically. Add:

- **Carousel:** in Playground, the "Project gallery" carousel exists above the first project group, with one card per image project in the data. Clicking "Next project" changes the front card's name. The front card links to a `/projects/<slug>` that resolves.
- **No carousel in Light:** the gallery is absent in Light.
- **Decoded text:** project names and section titles in Playground still expose their exact text to `getByRole("heading", { name })`.

## Verification

1. Capture screenshots at 1440×900 and 1280×800 of the homepage (top, carousel, projects, footer) and of two case studies (one screenshot-based, plus AuthCore). Compare them against the Interaction Playground source, running it with `npm run dev` on port 5174 in its repo, or using `docs/screenshots/*.jpg`.
2. Check that Light, Dark and Observatory are unchanged, using ticket 1's screenshot comparison.
3. Confirm the jellyfish, carousel and decode code load only in Playground: the `/` First Load JS is unchanged, and the network panel shows the chunk only after switching.
4. Run `npm run lint`, `npm run format:check`, `npm run build` and `PW_HEADLESS=true npm test`.

## Out of scope

- Any other Interaction Playground demo: notifications, Dynamic Island, location selector and so on.
- Sound (the source's `sound.ts`).
- A dark variant of Playground.
