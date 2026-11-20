---
title: "Ticket 3 — Deep Field theme"
status: dropped
created: 2026-11-19
depends-on: 01-theme-foundation-menu-observatory.md
read-first: docs/tickets/site-themes/README.md
---

# Ticket 3: Deep Field theme

> **Dropped (2026-11-20).** The theme was built and then removed at the owner's request. This ticket is kept for history only.

## Goal

Add a **Deep Field** entry to the theme menu. It restyles the homepage and every case-study page in the spirit of Journey Through Space:

- an ink-blue void with an ice-cyan accent;
- JetBrains Mono throughout;
- a parallax starfield that streaks into warp lines when you scroll fast;
- glass "instrument" panels;
- sections presented as observation stops on a journey from Earth to Sagittarius A*.

It should feel calm and scientific, not neon. Observatory is the loud one.

When this ticket is done, the owner can run `npm run dev`, pick Deep Field from the menu, and see all of this.

Read `README.md` in this folder first. Use the theme system from ticket 1 and don't fork the shared components.

**Source project:** `~/GitHub/design/journey-through-space`

- `src/styles.css`: tokens, glass variables and `.vignette` at the top.
- `src/starfield.ts`: `Starfield` and `StreakField`, for the concept. This ticket **does not** port its three.js shaders; it builds a 2D canvas instead.
- `src/instruments.ts`: the readout style.
- `src/journey.ts` and `src/worlds.ts`: the names and distances of the stops.

## Registry entry

| id           | label      | description                      | scheme | themeColor |
| ------------ | ---------- | -------------------------------- | ------ | ---------- |
| `deep-field` | Deep Field | A quiet voyage through the stars | dark   | `#020609`  |

Menu position: after Playground.

## Fonts

`JetBrains_Mono` via `next/font/google`, variable weight, `preload: false`, as `--font-jetbrains`. Use it for all three roles. Journey Through Space is mono everywhere.

```
--font-display: var(--font-jetbrains);
--font-body: var(--font-jetbrains);
--font-label: var(--font-jetbrains);
```

Mono text runs wide, so in this theme:

- body paragraphs drop to `0.875rem` with `line-height: 1.7`;
- the hero `h1` uses weight 500 at about 2.25rem with `tracking -0.02em`;
- labels are 11 px with `.08em` tracking, uppercase.

Check that no line, label or nav item overflows at 1280 px and 390 px.

## Tokens

```
--color-paper: 2 6 9;           /* #020609 */
--color-ink: 229 237 241;       /* #e5edf1 */
--color-accent: 145 211 231;    /* #91d3e7 ice cyan */
--color-accent-2: 46 232 154;   /* #2ee89a speed green */
--color-signal: 46 232 154;
--color-neutral-100: 7 17 27;   /* glass base #07111b */
--color-neutral-200: 18 33 45;
--color-neutral-300: 33 52 66;
--color-neutral-400: 106 130 150; /* raised from the source's #526779 to pass 4.5:1 */
--color-neutral-500: 128 149 165;
--color-neutral-600: 169 188 200; /* #a9bcc8 muted */
--color-neutral-700: 205 218 226;
--radius-panel: 10px;
--glass-bg: rgba(7, 17, 27, 0.66);
--glass-bg-strong: rgba(6, 15, 24, 0.9);
--glass-border: rgba(145, 211, 231, 0.2);
--glass-border-hover: rgba(145, 211, 231, 0.52);
--glass-shadow: 0 16px 40px rgba(0, 0, 0, 0.48);
```

Also: `::selection` uses `#295369` with white text, and the scrollbar is `scrollbar-color: #526779 var(--paper)`, both from the source.

## Background: starfield (`ThemeLayer` Background)

Build a 2D-canvas starfield, `src/themes/deep-field/Starfield.tsx`, fixed full-viewport behind the content.

- **Stars:** about 1,400, spread across three depth layers: far 60%, mid 30%, near 10%.
  - **Size:** 0.6–1.8 px by depth.
  - **Brightness:** 0.25–0.9, with 5% of stars slightly blue (`#cfe6ff`) and 3% warm (`#ffe2c4`).
  - Use a seeded RNG so the field looks the same on every load.
- **Twinkle:** each star's alpha varies by about ±15% on its own slow sine, with a 3–9 s period.
- **Parallax:** stars move upward as the page scrolls down, by `scrollY × speed`. Speeds: far 0.04, mid 0.10, near 0.22. Wrap stars vertically.
- **Warp streaks:**
  - **Velocity:** measure scroll velocity in px/s as a smoothed value.
  - **Streak length:** above 900 px/s, each star draws as a line along the scroll direction. Its length is `min(velocity × depthSpeed × 0.06, 90px)`, and its alpha fades along the line.
  - **Decay:** streaks relax back to points over about 400 ms after scrolling slows.
  - **Readout hook:** the distance readout below reads this same velocity.
  - **Lenis:** the site uses Lenis smooth scroll, so read `window.scrollY` every frame rather than relying on scroll events.
- **Nebula:** a faint, static radial wash drawn once to an offscreen canvas. Use two blobs, `rgba(145,211,231,.05)` upper left and `rgba(120,80,200,.04)` lower right, so the void isn't flat.
- **Vignette:** port the source's `.vignette`, with its eased multi-stop left and bottom falloffs at the same stop values, as a fixed overlay above the canvas and below the content. It keeps text over the starfield readable.
- **Performance:**
  - desktop only (`min-width: 1024px`);
  - device pixel ratio capped at 2;
  - pause while the tab is hidden;
  - stop the frame loop when the theme unmounts;
  - aim for 60 fps.
  - Below 1024 px, show only the nebula and vignette as a static CSS background.

## Overlay: distance readout (`ThemeLayer` Overlay, desktop only)

A small fixed instrument, styled after `src/instruments.ts`.

- **Placement:** bottom-left, 24 px from the edges, `aria-hidden`.
- **Panel:** glass (`--glass-bg`, 1 px `--glass-border`, 10 px radius, blur 12 px), 11 px uppercase text.
- **Content:**

  ```
  DIST  1.52 AU
  VEL   0.31 c
  STOP  02 / 04 · MARS
  ```

- **`DIST`** is interpolated from scroll progress through the stops in the table below. Interpolate logarithmically between them so the numbers keep accelerating. Units step km → AU → ly as the value grows.
- **`VEL`** maps scroll velocity to 0.00–0.99 c, with smoothing.
- **`STOP`** is the stop of the current section.
- **Clamping:** keep the panel clear of the footer. Hide it once the colophon is in view.

| Section       | Stop name    | Distance  |
| ------------- | ------------ | --------- |
| Top / Hero    | EARTH · LEO  | 400 km    |
| 01 Projects   | MARS         | 1.52 AU   |
| 02 Experience | VOYAGER 1    | 169 AU    |
| 03 Education  | ORION NEBULA | 1,344 ly  |
| 04 Contact    | SGR A*       | 26,670 ly |

Section ids come from the existing headings: `projects`, `experience`, `education` and `contact`. The current stop is the last section whose heading has passed 40% of the viewport height, which is the same rule `Header.tsx` uses. At the very bottom of the page, the current stop is Contact.

## Type and surfaces

- **`site-header`:**
  - Glass: `--glass-bg-strong` with a 12 px blur and a `--glass-border` bottom border.
  - The name is in ink, weight 500.
- **`nav-pill`:**
  - Transparent, with a 1 px `--glass-border-hover` border and a 6 px radius.
  - Highlighted text stays `ink`; it does not flip to `paper`.
- **`scroll-progress`:**
  - 1 px high, in the accent color.
  - A 4 px bright head with a soft glow at its leading edge, like a moving probe.
- **`section-heading`:**
  - **`section-index`:** an observation-stop code.
    - `::before { content: "STOP " }`, followed by the number.
    - Then `::after { content: attr(data-coord) }`. Add a `data-coord` attribute to each `section-index` holding that section's stop name and distance from the table above, e.g. `"MARS · 1.52 AU"`.
    - All in `neutral-500`, 11 px uppercase.
  - **`section-title`:** weight 500, about 1.25rem, `ink`.
  - **The rule:** a 1 px `--glass-border` line with small `+` crop marks at both ends, drawn with pseudo-elements.
- **`hero`:**
  - **`hero-kicker`:** accent, uppercase.
  - **`hero-note`:** a glass panel.
  - **Availability dot:** speed green with a slow pulse ring: scale 1 → 2.4 and fade, every 2.4 s.
- **`project-row`:** glass instrument cards with 10 px gaps between rows instead of hairlines.
  - Background `--glass-bg` with `backdrop-filter: blur(10px)`.
  - 1 px `--glass-border`, 10 px radius, `--glass-shadow`.
  - **Hover:** the border goes to `--glass-border-hover` and the card lifts 1 px.
- **`project-thumb`:**
  - 6 px radius, 1 px `--glass-border`.
  - On row hover, a **reticle overlay** appears:
    - four corner brackets drawn with pseudo-elements;
    - a centered `+`;
    - a coordinate label in the bottom-right, built from the project's index: `RA 0h·Dec +02°`.
    - It fades in over 200 ms.
- **`project-name`:** weight 500, `ink`.
- **`project-meta` and stack line:** `neutral-500`, 11 px.
- **`project-actions`:**
  - Bordered glass buttons, 6 px radius, uppercase 11 px.
  - "Case study" has the accent border and accent text.
  - **Hover:** the text goes white, as in the source's `button:hover`.
- **`project-group-label`:** uppercase, `.12em` tracking, accent. The rule is `--glass-border`.
- **`link-preview`:** a glass panel at `--glass-bg-strong`.
- **`entry`:** the period is accent-colored, uppercase. The disclosure summary is a glass button.
- **`contact`:**
  - The headline is weight 500, about 1.75rem.
  - The email link is accent with a glow, `text-shadow: 0 0 12px rgba(145,211,231,.35)`.
- **`colophon`:** an `::after` with `content: "  ·  END OF TRANSMISSION · 26,670 ly"` in `neutral-500`.

## Case-study page

- **`cs-header`:** the same glass header. Previous and next links are labelled as stops: add an `::before` of `"◂ "` / `"▸ "` in the accent color.
- **`cs-title`:** weight 500, about 2.25rem. The kicker reads `OBSERVATION · <category> · <year>`.
- **`cs-media`:** an "observation window."
  - A glass frame with crop marks in all four corners.
  - The reticle overlay shows **always** on this page, at 50% opacity, rising to 100% on hover.
  - A bottom strip in 11 px: `EXPOSURE 1/60 · FILTER VIS`, decorative and `aria-hidden`.
- **`panel`:** glass panels.
  - Labels are uppercase and accent-colored, prefixed with the panel's `data-code`: `FCT ·`, `ARC ·`, `DEC ·`, `GAL ·`.
  - The facts panel has no visible label today. Give it a decorative `::before` reading `FCT · OBSERVATION LOG`. Its `sr-only` h2 stays as it is.
- **`cs-metric`:** instrument readouts.
  - Glass tile; the value is in accent, weight 500 at about 1.75rem.
  - The label is 10 px uppercase.
  - A thin 1 px meter line under the value fills from 0 to 100% when revealed, over 700 ms.
- **`cs-decision`:** glass cards with a 2 px accent left border.
- **Architecture diagram:** the tokens drive it. Its edges get the accent color at 60%.

## Motion

- **Reveal preset "focus pull":** 0.7 s with `cubic-bezier(0.22, 1, 0.36, 1)`.
  - `filter: blur(10px)` → `blur(0)`.
  - `scale` 1.02 → 1, opacity 0 → 1.
  - A chromatic fringe fades out over the first 60%: `textShadow` from `-1.5px 0 rgba(255,80,80,.35), 1.5px 0 rgba(80,180,255,.35)` to none.
- **Hero headline:** keep `SplitWords`' word rise, but each word also comes in from `blur(6px)`. Register this as Deep Field's `headline` effect.
- **Enter effect on switching into Deep Field:** the starfield starts with a single 600 ms warp burst, with streaks at full length that relax, as if arriving.

## Tests

The ticket 1 theme loop covers the basics automatically. Add:

- **Readout absent on narrow screens:** in Deep Field at 390 px, the distance readout is absent or hidden.
- **Readout updates:** at 1440 px it exists, and its stop text changes from `EARTH` to `MARS` after scrolling to `#projects`.
- **Canvas only on desktop:** the starfield canvas exists only at 1024 px wide and above.

## Verification

1. Capture screenshots at 1440×900 and 1280×800 of the homepage (top, projects, experience, footer) and two case studies.
2. Run a manual check while scrolling fast, to confirm the streaks appear and relax.
3. Compare against Journey Through Space's look, using its `docs/screenshots` if present, or `npm run dev` in its repo.
4. Use the Performance panel or a short `requestAnimationFrame` counter to confirm the starfield holds about 60 fps on desktop and stops when the theme changes.
5. Confirm the other themes are unchanged and the `/` First Load JS is unchanged.
6. Run `npm run lint`, `npm run format:check`, `npm run build` and `PW_HEADLESS=true npm test`.

## Out of scope

- WebGL or three.js. Porting the source's shaders is out of scope.
- Audio.
- Planet renders.
