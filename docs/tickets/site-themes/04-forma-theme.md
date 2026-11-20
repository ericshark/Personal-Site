---
title: "Ticket 4 — Forma theme"
status: done
created: 2026-11-19
depends-on: 01-theme-foundation-menu-observatory.md
read-first: docs/tickets/site-themes/README.md
---

# Ticket 4: Forma theme

## Goal

Add a **Forma** entry to the theme menu. It restyles the homepage and every case-study page in the spirit of Liquid Sculpture (FORMA®), an editorial, gallery-like study in obsidian, alabaster and liquid silver:

- large tight sans headings paired with italic Instrument Serif;
- silver gradient type with a slow sheen;
- film grain over everything;
- monochrome screenshots that bloom into color on hover;
- slow silver smoke that stirs as the pointer moves.

It is the quiet, high-end theme, and it should look the least like the others.

When this ticket is done, the owner can run `npm run dev`, pick Forma from the menu, and see all of this.

Read `README.md` in this folder first. Use the theme system from ticket 1 and don't fork the shared components.

**Source project:** `~/GitHub/design/liquid-sculpture`

- `app/globals.css`: dark tokens, the `body::after` film grain, the `reveal-rise` keyframes.
- `app/layout.tsx`: the fonts.
- `components/section-heading.tsx`: the index line and the `Accent` italic-serif emphasis.
- `components/sticky-header.tsx`: the pill buttons.
- `components/smoke-section.tsx`: how the fluid is seeded and driven, with the silver tones.
- `lib/fluid-smoke.ts`: the WebGL fluid, 671 lines with no dependencies.

## Registry entry

| id      | label | description                           | scheme | themeColor |
| ------- | ----- | ------------------------------------- | ------ | ---------- |
| `forma` | Forma | Obsidian, alabaster and liquid silver | dark   | `#07080a`  |

Menu position: last.

## Fonts

- **Display and body:** Geist Sans, already loaded.
- **Labels:** Geist Mono, already loaded.
- **Emphasis:** `Instrument_Serif` via `next/font/google`, weight 400, normal and italic styles, `preload: false`, as `--font-instrument`.

```
--font-display: var(--font-geist-sans);
--font-body: var(--font-geist-sans);
--font-label: var(--font-geist-mono);
--font-serif: var(--font-instrument);  /* new, Forma only */
```

## Tokens

```
--color-paper: 7 8 10;          /* #07080a obsidian */
--color-ink: 244 245 247;       /* #f4f5f7 alabaster */
--color-accent: 200 206 216;    /* #c8ced8 silver */
--color-accent-2: 212 216 225;  /* #d4d8e1 primary */
--color-signal: 200 206 216;
--color-neutral-100: 13 15 19;  /* #0d0f13 card */
--color-neutral-200: 20 23 30;  /* #14171e secondary */
--color-neutral-300: 38 43 54;
--color-neutral-400: 115 122 138; /* raised for 4.5:1 */
--color-neutral-500: 142 149 163; /* #8e95a3 muted-foreground */
--color-neutral-600: 180 186 197;
--color-neutral-700: 212 216 225;
--radius-panel: 4px;
--silver-soft: rgb(200 206 216 / 12%);
--silver-sheen: linear-gradient(100deg, #f4f5f7 0%, #8e95a3 35%, #f4f5f7 50%, #8e95a3 65%, #f4f5f7 100%);
```

Hairlines use `--silver-soft`. `::selection` uses a silver background with obsidian text.

## Background: silver smoke (`ThemeLayer` Background)

- Port `lib/fluid-smoke.ts` unchanged to `src/themes/forma/fluid-smoke.ts`, then mount it from `src/themes/forma/SilverSmoke.tsx`. Follow `smoke-section.tsx`, with these changes:
  - The canvas is **fixed full-viewport** behind the content, not a page section.
  - Set `pointer-events: none` on the canvas. Listen for `pointermove` on `window` and convert to viewport UV coordinates.
  - Set `settings.paper = false`.
- **Seeding:** use the same three silver plumes on mount, and the `SILVER_TONES` palette.
  - **Pointer splats:** at most one per 40 ms.
  - **Strength:** scale it down by about 40% from the source, so the smoke stays behind the text and doesn't compete with it.
- **Opacity:** run the canvas at `opacity: .55`, with a vignette overlay that darkens toward the column center (`radial-gradient(ellipse 60% 80% at 50% 40%, rgba(7,8,10,.55), transparent 70%)`), so body text keeps 4.5:1 contrast.
- **Idle:** without pointer input for 4 s, add one gentle rising splat every 2.5 s, so the scene never goes fully still.
- **Fallbacks:**
  - If `Fluid.create` returns null, or `isSoftwareRenderer()` is true, render no canvas. Show a static silver radial-gradient wash instead.
  - Below 1024 px, show only the static wash.
- **Lifecycle:** pause while the tab is hidden, and destroy the GL context on unmount, so switching themes doesn't leak WebGL contexts.

## Film grain

Port the source's `body::after` grain: an SVG `feTurbulence` data-URI, fixed, `opacity: .04`, `pointer-events: none`.

- Use `z-index: 65`. That sits above the header (50) and scroll progress (60), and below the theme menu popover (70).
- Scope it under `[data-theme="forma"]`.

## Type and surfaces

- **`site-header`:**
  - Transparent at the top; when scrolled, `bg-paper/70` with a 16 px blur and a `--silver-soft` bottom border.
  - The name is Geist 600, `tracking -0.02em`.
- **`nav-pill`:** a rounded-full pill with a `--silver-soft` fill and a 1 px `--silver-soft` border. Text stays `ink`.
- **`scroll-progress`:** 1 px, using the silver sheen gradient.
- **`section-heading`:** follows the source's `section-heading.tsx`.
  - **`section-index`:** Geist Mono 11 px, uppercase, `.18em` tracking, silver. Its `::after` is a 40 px × 1 px silver line at 60% opacity, inline after the number.
  - **`section-title`:** **Instrument Serif italic**, about 2.75rem on desktop, `leading-[0.98]`, `tracking -0.015em`, with the silver sheen applied as clipped background text.
  - Remove the top border rule. Space alone separates the sections.
- **`hero-headline`:**
  - Geist 500, about 3rem on desktop, `leading-[1.02]`, `tracking -0.035em`, `ink`.
  - **The last three words** render in Instrument Serif italic with the silver sheen, matching the source's `Accent` pattern.
  - Build the split in Forma's `headline` effect by splitting the string. Do not change the data.
- **Silver sheen motion:** text with the sheen has `background-size: 200% 100%`, and its `background-position` moves from 100% to 0% in an 8 s linear loop.
- **`hero-kicker`:** Geist Mono 11 px, uppercase, `.18em` tracking, `neutral-500`.
- **`hero-note`:**
  - No card. Only a `--silver-soft` top hairline and generous spacing.
  - The about paragraphs are `neutral-600` with `leading-relaxed`.
- **`project-row`:**
  - Keep the hairline-divided list, using `--silver-soft`, and increase row padding by about 30%. This is a gallery index, not cards.
  - **Hover:** the row's name slides 6 px right, and a silver `→` fades in at the far right.
- **`project-thumb`:** **monochrome at rest.**
  - `filter: grayscale(1) contrast(1.05) brightness(.9)`, a 2 px radius, and a 1 px `--silver-soft` border.
  - On row hover or focus, it eases to full color over 600 ms with `cubic-bezier(.16,1,.3,1)`, plus `scale(1.02)` inside the frame.
- **`project-name`:** Geist 500, about 1.25rem, `tracking -0.02em`.
- **`project-meta` and stack line:** Geist Mono 11 px, `neutral-500`.
- **`project-group-label`:** Geist Mono, `.18em` tracking, silver, with the 40 px rule from `section-index`.
- **`project-actions`:**
  - Pill buttons from `sticky-header.tsx`.
  - "Case study" is filled (`bg-ink text-paper`, rounded-full, `px-3.5 py-1.5`, `hover:opacity-85`).
  - Live and GitHub are text links whose silver underline draws in.
- **`link-preview`:** `bg-neutral-100` with a 1 px `--silver-soft` border and a 4 px radius. The image is monochrome, matching the thumbnails.
- **`entry`:**
  - The period is Geist Mono, silver.
  - The role is Geist 500.
  - The org line is in Instrument Serif italic, `neutral-600`.
  - The disclosure summary is a rounded-full outline pill.
- **`contact`:**
  - The headline is Instrument Serif italic, about 2.5rem, with the silver sheen.
  - The email link is Geist 500, about 1.25rem, `ink`, with a silver underline that draws in.
- **`colophon`:** Geist Mono 11 px, uppercase, `.18em` tracking, followed by `::after { content: "  FORMA" }` in silver.

## Case-study page

- **`cs-header`:** the same transparent header that blurs on scroll. Previous and next links are text links with an Instrument Serif italic project name.
- **`cs-title`:** Geist 500, about 3rem, `tracking -0.035em`. The kicker is Geist Mono uppercase in silver.
- **`cs-actions`:** a filled ink pill for Live and an outline pill for GitHub.
- **`cs-media`:** **full color**, since this is the hero image.
  - 2 px radius with a 1 px `--silver-soft` border.
  - A soft silver glow behind it: `0 40px 120px -40px rgba(200,206,216,.18)`.
- **`panel`:**
  - No fills. Panels are separated by `--silver-soft` hairlines, with generous padding.
  - Labels are Geist Mono uppercase, `.18em` tracking, silver.
- **`cs-metric`:**
  - The value is **Instrument Serif** (not italic) at about 3rem with the silver sheen.
  - The label is Geist Mono 11 px.
  - Tiles have no boxes. Thin vertical hairlines separate them.
- **`cs-decision`:** the title is Geist 500, and the body is `neutral-600`. A large Instrument Serif italic numeral (`01`, `02`…) in `neutral-400` sits beside each decision.
  - **Implementation:** add a `data-index` attribute in the case-study markup and render the numeral as an `::before` with `content: attr(data-index)`, so it appears only in Forma.
- **Gallery:** images are monochrome and turn to color on hover, matching the thumbnails.

## Motion

- **Reveal preset "rise":** the source's `reveal-rise`. Opacity 0 → 1 and `y` 28 px → 0, over 0.9 s with `cubic-bezier(0.16, 1, 0.3, 1)`. No blur.
- **Image curtain:** `project-thumb` and `cs-media` reveal with:
  - `clipPath` going from `inset(100% 0 0 0)` to `inset(0)`, over 1.1 s with the same easing;
  - while the image inside scales 1.08 → 1.
  - Implement this through Forma's preset for elements with those hooks.
- **Hero headline:** `SplitWords`' word rise, slowed to 0.9 s per word with a 0.05 s stagger. The serif accent words arrive last.
- **Enter effect on switching into Forma:** the smoke gets three seed plumes, and every `section-title` currently in view plays its sheen once at 3× speed.

## Tests

The ticket 1 theme loop covers the basics automatically. Add:

- **Hero headline text:** in Forma, the hero `h1`'s accessible name equals the full `profile.headline`, even though the text is split for the serif accent.
- **No WebGL leak:** switching Forma → Light → Forma three times leaves at most one smoke canvas in the DOM, with no console errors. In Playwright, WebGL may fall back to software rendering; that path must also produce no errors.

## Verification

1. Capture screenshots at 1440×900 and 1280×800 of the homepage (top, projects with one row hovered, experience, footer) and two case studies.
2. Compare against Liquid Sculpture (`docs/screenshots/*.jpg`, or `pnpm dev --port 3001` in its repo).
3. Check text contrast over the smoke at its brightest. Body copy must stay at or above 4.5:1. If it doesn't, lower the canvas opacity or strengthen the vignette.
4. Confirm the other themes are unchanged and the `/` First Load JS is unchanged.
5. Run `npm run lint`, `npm run format:check`, `npm run build` and `PW_HEADLESS=true npm test`.

## Out of scope

- The particle sculpture hero from Liquid Sculpture.
- A light variant of Forma.
- A custom cursor.
