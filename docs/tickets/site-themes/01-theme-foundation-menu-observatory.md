---
title: "Ticket 1 — Theme foundation, theme menu, and the Observatory theme"
status: done
created: 2026-11-19
depends-on: none
read-first: docs/tickets/site-themes/README.md
---

# Ticket 1: Theme foundation, theme menu, and the Observatory theme

## Goal

When this ticket is done, the owner can run `npm run dev`, click the new palette button in the header, and switch the whole site between **Light**, **Dark** and **Observatory**. The switch covers the homepage and every `/projects/<slug>` page.

- Light and Dark look exactly as they do today.
- Observatory restyles the same layout as a cyberpunk HUD, in the style of World Observatory.
- The theme system is built so that tickets 2–4 each add a theme by adding a folder and one entry to a list. They don't touch the existing components again, apart from a theme-only slot or hook where their ticket names one.

Read `README.md` in this folder first. Its shared decisions apply here.

## Part A: Theme foundation

### Current state (what to replace)

- `src/lib/theme.ts`
  - Stores `THEME_STORAGE_KEY = "theme"` and two `themeColors`.
  - An inline script in `<head>` adds the `dark` class before first paint.
- `src/components/ThemeToggle.tsx`: the moon/sun button. It is used in `Header.tsx` and in `src/app/projects/[slug]/page.tsx`.
- `src/app/globals.css`
  - Color channels sit on `:root` (light) and `.dark`.
  - Tailwind maps `paper`, `ink`, `accent` and `neutral-100…700` to them (`tailwind.config.ts`, `darkMode: "class"`).
- `Reveal.tsx` handles every scroll reveal (blur, fade and rise via `InView`). `SplitWords.tsx` animates the hero headline, and `TextEffect` animates the about paragraphs.
- Hardcoded colors that bypass the color tokens:
  - `ActionPreview` in `src/components/Projects.tsx` (`bg-white`, `text-zinc-*`, `border-zinc-200`, `bg-zinc-100`).
  - The `text-red-600 dark:text-red-400` error text in `src/components/ProjectVisuals.tsx`.

### A1. Theme registry: `src/themes/registry.ts`

This is the single list of themes. Nothing else may hardcode theme ids.

```ts
export type ThemeId = "light" | "dark" | "observatory"; // tickets 2–4 extend this union
export type ThemeDefinition = {
  id: ThemeId;
  label: string; // menu label, e.g. "Observatory"
  description: string; // one line in the menu, e.g. "Cyberpunk command HUD"
  scheme: "light" | "dark"; // dark adds the `.dark` class so existing dark: utilities apply
  themeColor: string; // <meta name="theme-color"> value
};
export const THEMES: readonly ThemeDefinition[]; // menu order
export const DEFAULT_THEME: ThemeId = "light";
export function isThemeId(value: unknown): value is ThemeId;
```

Entries for this ticket:

| id            | label       | description                | scheme | themeColor |
| ------------- | ----------- | -------------------------- | ------ | ---------- |
| `light`       | Light       | Paper and ink, the default | light  | `#fafaf9`  |
| `dark`        | Dark        | The same site, after hours | dark   | `#0c0c0d`  |
| `observatory` | Observatory | Cyberpunk command HUD      | dark   | `#05040d`  |

### A2. Applying the theme

- **On `<html>`, the server renders** `data-theme="light"` (keep `suppressHydrationWarning`).
- **The no-flash init script** is generated from `THEMES` in `src/themes/init-script.ts` and replaces `themeInitScript` in `src/lib/theme.ts`. Delete `src/lib/theme.ts` when nothing imports it. The script must:
  - read `localStorage.theme` and ignore anything that is not a known id;
  - set `data-theme`, and add `.dark` when the theme's scheme is dark;
  - set the `theme-color` meta content;
  - run inside `try/catch`, as it does today.
- **`src/themes/use-theme.ts`** provides two functions:
  - `useThemeId()` uses `useSyncExternalStore`:
    - **subscribe:** a `MutationObserver` on `document.documentElement`, filtered to `data-theme`.
    - **snapshot:** `documentElement.dataset.theme`.
    - **server snapshot:** `"light"`.
    - So server and first client render agree, and components update after hydration and after every switch.
  - `setTheme(id, origin?)` applies the attribute, `.dark`, the meta color and `localStorage`. Storage can be blocked, so wrap it in `try/catch`. If `document.startViewTransition` exists, wrap the change in it. **Transition:** a circular `clip-path` reveal of `::view-transition-new(root)`. It starts at `origin`, the center of the palette button, and grows to cover the viewport in 500 ms with `cubic-bezier(0.22, 1, 0.36, 1)`. Turn off the default cross-fade on `::view-transition-old(root)` and `-new(root)`. Without View Transitions support, apply the theme instantly.
- **Tokens move from `.dark` to `[data-theme="dark"]`.** Define light tokens under both `:root` and `[data-theme="light"]`. Every theme's tokens use an attribute selector that **is not limited to `html`**, so any element with `data-theme="x"` re-scopes its subtree. The menu swatches rely on this, in A5.
- **Keep the `.dark` class** for Tailwind's `dark:` variant, but don't use it to define tokens anymore.

### A3. Token additions

Keep every existing color token, and add these:

- **Colors:**
  - `--color-accent-2`: a secondary accent, defaulting to the same value as `--color-accent`.
  - `--color-signal`: the availability dot, defaulting to the accent.
  - Map both in `tailwind.config.ts` as `accent-2` and `signal`.
- **Fonts:**
  - `--font-body` → Tailwind `font-sans`, defaulting to `var(--font-geist-sans)`.
  - `--font-display` → new Tailwind `font-display`, defaulting to `var(--font-geist-sans)`.
  - `--font-label` → Tailwind `font-mono`, defaulting to `var(--font-geist-mono)`.
- **Shape:** `--radius-panel` defaults to `0.5rem` and is used where panels are `rounded-lg`.

Add `font-display` to these elements. With the defaults, this changes nothing visually.

- the hero `h1`
- `SectionHeading` titles
- project group labels and project names
- Experience roles and Education headings
- the contact headline
- the case-study `h1`
- metric values
- decision titles

### A4. Hooks for theme styling: `data-ui` attributes

Themes restyle the shared markup through `data-ui` attributes. They never fork components. Add these attributes. Each is the contract that theme CSS targets:

| `data-ui`                                                                                  | Element                                                                                         |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `site-header`                                                                              | homepage `<header>` and the case-study `<header>`                                               |
| `column`                                                                                   | the inner `max-w-site` / `max-w-6xl` containers of the header, main, footer and case-study main |
| `nav-pill`                                                                                 | the `motion.span` highlight in `Header.tsx`                                                     |
| `scroll-progress`                                                                          | the bar in `ScrollProgress.tsx`                                                                 |
| `hero`, `hero-kicker`, `hero-headline`, `hero-note`                                        | `Hero.tsx`: the section, the role/location line, the `h1`, and the about `aside`                |
| `section-heading`, `section-index`, `section-title`                                        | `SectionHeading.tsx` (give the index span `data-code` with its number, e.g. `data-code="01"`)   |
| `project-group`, `project-group-label` (+ `data-count`, padded to two digits, e.g. `"03"`) | each kind group in `Projects.tsx`, and its `h3`                                                 |
| `project-row` (+ `data-kind="Engineering\|Product\|Visual"`)                               | each project `<li>`                                                                             |
| `project-thumb`, `project-name`, `project-meta`, `project-actions`                         | the parts of the row                                                                            |
| `link-preview`                                                                             | `ActionPreview`                                                                                 |
| `entry`                                                                                    | each Experience and Education entry; `entry-details` is the disclosure                          |
| `contact`                                                                                  | footer contact section; `colophon` is the © line                                                |
| `cs-header`, `cs-title`, `cs-actions`, `cs-media`, `cs-metric`, `cs-decision`              | case-study page parts                                                                           |
| `panel` (+ `data-code`)                                                                    | case-study panels: facts `FCT`, architecture `ARC`, decisions `DEC`, gallery `GAL`              |

### A5. Fix the hardcoded colors

- **`ActionPreview`:** replace the hardcoded classes with tokens (`bg-paper`, `text-ink`, `border-neutral-200`, `bg-neutral-100`, `text-neutral-500`). Light must look the same. Today it is pure white on `#fafaf9` paper, which you may keep through a `--color-surface` token (`255 255 255` light, the current dark value for dark) if it reads better.
- **`ProjectVisuals.tsx`:** add an `--color-danger` token (light `220 38 38`, dark `248 113 113`) and use `text-danger`.

### A6. Theme-aware motion

- **`Reveal.tsx`** becomes `"use client"`. It reads `useThemeId()` and takes its `variants` and `transition` from `src/themes/motion.ts`, using `revealPreset(themeId)`. Themes without a preset fall back to today's blur-fade.
- **The SSR rule:** the server always renders the default preset's hidden state. It is hidden in every preset, so the swap after hydration causes no flash.
- **Hero headline:** `Hero.tsx` renders it through a `HeroHeadline` client wrapper. The wrapper uses `SplitWords` by default, and a theme can register its own headline effect. For Observatory, that is the typed effect described in Part C.
- **Theme switch rule:**
  - Content that is already revealed stays visible after a switch. Never re-hide it.
  - A theme may play a one-shot "enter" effect on elements currently in the viewport. Observatory does: see Part C.

### A7. Theme layer and slots: `src/themes/client.tsx`

- **`<ThemeLayer />`** is mounted once in `layout.tsx`. It renders the active theme's fixed background and overlays, loaded with `next/dynamic({ ssr: false })`, so each theme's code is fetched only when that theme is active. It renders nothing for Light and Dark.
- **`<ThemeSlot name="…" data={…} />`** renders the active theme's component for a named slot, or nothing.
  - Its props must be serializable, because server components pass them in.
  - Theme slot components **must not import `src/data/portfolio.ts`**. Pass the data they need through the slot, so the large data module stays out of client bundles.
  - Ticket 1 adds the slot `hero-kicker-extra`, inside the hero kicker line.
  - Ticket 2 adds `projects-intro`. Ticket 3 uses the theme layer.
- **Per-theme client modules** are registered in one map: `{ [id]: { Background?, Overlay?, slots?: { [name]: lazy component }, revealPreset?, headline? } }`.

### A8. Fonts

- Theme fonts load through `next/font` with **`preload: false`** and `display: "swap"`, exposed as CSS variables on `<html>`. The browser downloads a font only when a rendered element uses it.
- **This ticket:** `Chakra_Petch` (weights 400, 500, 600, 700) as `--font-chakra`.
- Keep the font setup in `src/themes/fonts.ts`, so later tickets add one line each.
- **Verify:** on the default theme, the browser makes no font requests other than Geist and Geist Mono.

### A9. Theme CSS

- Each theme's CSS lives in `src/themes/<id>/theme.css`. Import it in `layout.tsx` after `globals.css`.
- Every selector is scoped under `[data-theme="<id>"]`, so a theme can't leak into another one.
- **Budget:** all theme CSS together stays under about 12 kB gzip.

## Part B: Theme menu (`src/components/ThemeMenu.tsx`)

`ThemeMenu` replaces `ThemeToggle` in both headers. Delete `ThemeToggle.tsx`.

**Trigger**

- Same spot and size as today: a 44×44 `.action-quiet` button.
- Icon: lucide `Palette`, 16 px, stroke 1.5.
- `aria-label="Theme"`, `aria-haspopup="menu"`, `aria-expanded`.
- Hover: the icon rotates −12°, in the same style as the existing sun and moon hover rules in `globals.css`.

**Popover**

- Anchored below the button and right-aligned to its right edge, with an 8 px gap. Width 18rem, capped at `calc(100vw - 32px)`.
- Uses `bg-paper`, a `border-neutral-200` border, `--radius-panel` corners, a soft shadow, and `z-[70]` so it sits above the header and the scroll bar.
- **Open:** opacity 0→1, scale 0.96→1 and y −4→0 from the top-right corner, over 180 ms with `--ease-soft`. **Close:** 120 ms.
- A mono uppercase label "Theme" at 11px, then one option per entry in `THEMES`.

**Options**

- Each option is `role="menuitemradio"` with `aria-checked`. The list is `role="menu"`.
- **Layout of an option:**
  - On the left, a 56×36 **swatch** with `data-theme={id}` on it, so it renders in that theme's own tokens and fonts. It contains a `bg-paper` block, "Aa" in `font-display` and `text-ink`, and a 3 px `bg-accent` bar along the bottom edge.
  - On the right, the label (`text-sm`) and the description (`text-xs text-neutral-500`).
  - A `Check` icon on the active theme.
- **Hover and active state:** `bg-neutral-100`. Selecting an option calls `setTheme(id, buttonCenter)` and closes the menu.

**Keyboard and pointer**

- Enter, Space or ArrowDown on the trigger opens the menu and focuses the active option.
- ArrowUp and ArrowDown move between options, with wrap-around. Home and End jump to the first and last option.
- Enter or Space selects. Escape closes and returns focus to the trigger. Tab closes.
- A click outside closes the menu.

**Hydration:** the checked state comes from `useThemeId()`.

## Part C: The Observatory theme

The goal is World Observatory's command-center HUD applied to the portfolio's existing layout. Source: `~/GitHub/design/world-observatory/app/globals.css` (tokens at the top; `.hud-topbar`, `.telemetry-cell`, `.hud-panel`, `.hud-frame`, `.hud-inner`, `.hud-head`, `.hud-code`, `.hud-tick`, and the keyframes `hud-boot`, `scan`, `blink`) and `app/components/hud/HudPanel.tsx`.

### C1. Tokens

```
--color-paper: 5 4 13;          /* #05040d */
--color-ink: 238 242 255;       /* #eef2ff */
--color-accent: 45 226 255;     /* cyan #2de2ff */
--color-accent-2: 255 43 214;   /* magenta #ff2bd6 */
--color-signal: 61 255 168;     /* green #3dffa8 */
--color-neutral-100: 13 11 34;  /* panel ground */
--color-neutral-200: 31 27 69;  /* hairlines */
--color-neutral-300: 47 42 99;
--color-neutral-400: 124 122 158; /* #7c7a9e muted */
--color-neutral-500: 149 147 184;
--color-neutral-600: 169 168 200; /* #a9a8c8 secondary */
--color-neutral-700: 207 208 234;
--color-danger: 255 48 70;      /* #ff3046 */
--font-display: var(--font-chakra);
--font-body: var(--font-chakra);
--font-label: var(--font-geist-mono);
--radius-panel: 0;              /* angular: corners are clipped, not rounded */
```

Also define these local variables for skins: `--violet: #8a4dff`, `--cyan-dim: rgba(45,226,255,.35)`, `--magenta-dim: rgba(255,43,214,.35)` and `--line: rgba(130,120,220,.22)`.

### C2. Background

All of it is CSS. There is no canvas.

- **Body:** World Observatory's layered radial gradients over the paper color (`radial-gradient(ellipse 80% 60% at 50% 35%, #120c33, transparent 70%)` plus `ellipse 60% 40% at 15% 10%, #1a0830`).
- **Grid:** a fixed, full-viewport 48 px grid of `rgba(130,120,220,.05)` lines, with a radial mask so it fades toward the edges.
- **Scan lines:** a fixed overlay, `repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0 1px, transparent 1px 3px)`.
- **Wireframe globe (desktop only, ≥1024px):** use the World Observatory brand glyph (`HudTopBar.tsx`: a circle, an ellipse and 3 latitude lines), scaled up to about 560 px.
  - Fixed to the right edge of the viewport, vertically centered, at 12% opacity, with a cyan stroke and a `drop-shadow` glow. Render it as the theme's `Background` in `ThemeLayer`.
  - **Spin:** the meridian ellipse's `rx` animates 11 → 0 → 11 over 14 s, and a second meridian is offset by half a cycle, so the globe appears to spin.

### C3. Surfaces

- **`site-header`:** World Observatory's `.hud-topbar` treatment.
  - Background: `linear-gradient(180deg, rgba(10,8,30,.95), rgba(6,5,18,.85))` with backdrop blur.
  - Bottom border: a `border-image` running cyan → violet 40% → magenta 70% → transparent.
  - Shadow: `0 6px 30px rgba(45,226,255,.08)`.
  - Name: Chakra Petch 700, uppercase, `letter-spacing: .08em`, cyan, with a `text-shadow: 0 0 12px var(--cyan-dim)` glow.
- **`nav-pill`:** no filled pill.
  - The pill becomes transparent with a 1 px `--cyan-dim` border.
  - Add a 2 px magenta underline with a `0 0 10px` magenta glow. It slides as the existing `layoutId` pill does, following `.telemetry-cell::after`.
  - Highlighted text stays `ink`, not `paper`.
  - Nav labels are Geist Mono, uppercase, `letter-spacing: .12em`.
- **`scroll-progress`:** a cyan → violet → magenta gradient with a `0 0 8px` cyan glow.
- **`section-heading`:**
  - The top hairline becomes a 1 px gradient line, cyan → transparent.
  - **`section-index`:** render as a HUD code. `::before { content: "SEC-" }` and `::after { content: " //" }` in `--ink-muted`, with the number in cyan at 10 px.
  - **`section-title`:** Chakra Petch 700, uppercase, `.14em` tracking, cyan with a `--cyan-dim` text-shadow.
- **`hero`:**
  - **`hero-kicker`:** Geist Mono, cyan.
  - **`hero-headline`:** Chakra Petch 600, normal case, `ink`, with a faint `0 0 24px rgba(45,226,255,.15)` glow.
  - **`hero-note`:** becomes a HUD panel, like the project rows below.
  - **Availability dot:** `signal` green, blinking with World Observatory's `blink` keyframes (2.4 s).
  - **`hero-kicker-extra` slot:** a live `HH:MM:SS UTC` clock, as in World Observatory's `UtcClock`. It only renders after mount and is `aria-hidden`.
- **`project-row`:** each row becomes a separate HUD panel, with 10 px gaps between rows instead of the hairline dividers.
  - Rebuild the panel in CSS from `.hud-panel`, `.hud-frame` and `.hud-inner`:
    - A 1 px gradient frame.
    - A `clip-path` that cuts 12 px off the top-left and bottom-right corners.
    - An inner `--panel` background with the scan-line texture and backdrop blur.
    - Two corner ticks (`.hud-tick` as `::before` and `::after` on the row).
    - A slow scan band (the `scan` keyframes, 9 s, delayed by the row index).
  - **Tone by kind:** `data-kind="Engineering"` is cyan, `Product` is magenta, `Visual` is violet.
  - **Hover:** the frame brightens and the panel shows `filter: drop-shadow(0 0 10px <tone>)`.
  - **Clipping:** the link preview pops out above the row, so `clip-path` must not cut it off. Put the clip on an inner frame element, or render the frame with pseudo-elements, and keep `ActionPreview` outside the clipped box.
- **`project-thumb`:** the corner-cut frame in the tone color, with an inner `0 0 0 1px` tone ring. On row hover, it gets a 150 ms RGB-split flicker made from `drop-shadow` offsets, cyan to one side and magenta to the other.
- **`project-name`:** Chakra Petch 600, uppercase, `.06em` tracking.
- **`project-meta`:** Geist Mono, `--ink-muted`.
- **`project-actions`:** the `.hud-button` style.
  - 1 px tone-dim border, 10 px uppercase text, `.1em` tracking.
  - Hover fills the button with the tone color at 14%.
  - "Case study" is the solid button, with tone fill and `#120414` text.
- **`project-group-label`:** Chakra Petch 600, uppercase, magenta, with an `::after` code like `// 03 NODES` that shows the row count via a `data-count` attribute. The rule line becomes a gradient.
- **`link-preview`:** `--panel-strong` background, 1 px cyan border, corner-clipped, Geist Mono text.
- **`entry` (Experience and Education):**
  - A cyan 1 px vertical rail runs down the left column, with a 6 px glowing node at each entry.
  - The period is cyan Geist Mono, and the role is Chakra Petch uppercase.
  - The disclosure summary (`entry-details`) is a `.hud-button`.
- **`contact`:**
  - The headline is Chakra Petch 600.
  - The email link is cyan with a glow, and its underline is a magenta glow bar.
  - **`colophon`:** add an `::after` with `content: "  // END OF TRANSMISSION"` in `--ink-muted`.

### C4. Case-study page

- **`site-header` / `cs-header`:** the same top-bar treatment as the homepage header. The previous/next links are `.hud-button`s.
- **`cs-title`:** Chakra Petch 700, uppercase, cyan glow. The category and year kicker becomes a code: `PRJ // <category> · <year>`.
- **`cs-actions`:** `.hud-button`s. Live is solid cyan, GitHub is outlined.
- **`cs-media`:** a HUD frame with corner ticks.
  - `::before` shows a `FEED // LIVE` label in the top-left corner, 9 px, cyan.
  - A scan band sweeps the image every 9 s.
- **`panel`:** full HUD panels with a header strip.
  - The header strip shows `attr(data-code)` + ` //` in the tone color.
  - The existing visible panel labels ("Architecture", "Key decisions", "Gallery") are restyled as `.hud-head h2`: Chakra 700, uppercase, `.14em` tracking, tone color.
  - The facts panel's `sr-only` heading stays as it is. Its header strip shows the code only.
- **`cs-metric`:** World Observatory telemetry cells.
  - The value is Geist Mono 500 in cyan with a glow. The label is uppercase Chakra, 10 px.
  - A magenta underline bar scales in (`scaleX` 0→1, 300 ms) when the metric is revealed.
  - **Tick-up:** when a metric is revealed, values that are a plain integer with an optional suffix (`74`, `130+`, `217`) count up from 0 over 900 ms with an ease-out. Anything else, such as `1.2k`, `OTLP` or `<1s`, simply appears.
  - The real value is always in the DOM. The animated number lives in an `aria-hidden` span, and the real value is in a visually hidden span.
- **`cs-decision`:** small HUD panels in the magenta tone.
- **Architecture diagram:** the tokens drive it, so it themes automatically. Additionally, give its node strokes the cyan tone at `--cyan-dim` and add a faint glow.

### C5. Motion

- **Reveal preset "boot":** keyframes over 0.6 s with `cubic-bezier(0.2,0.8,0.2,1)`.
  - Opacity goes 0 → 1 → 0.35 → 1, which reads as a flicker.
  - `x` goes −14 px → 0.
  - `clipPath` goes `inset(0 100% 0 0)` → `inset(0 0 0 0)`.
  - Keep the existing per-row stagger.
- **Hero headline (`headline` effect for Observatory):** the text types in character by character, at about 18 ms per character, behind a blinking cyan block cursor (`▌`). The cursor blinks three times after the text finishes, then hides. The real text is in an `sr-only` copy, and the typed text is `aria-hidden`.
- **Enter effect on switching into Observatory:** every `project-row`, `panel` and `cs-metric` currently in the viewport plays the opacity flicker once (0.4 s). Nothing becomes hidden.
- **Ambient motion:**
  - The scan band runs on every panel.
  - The availability dot blinks.
  - The globe meridians spin.

## Tests (`tests/smoke.spec.ts`)

- **Remove the toggle tests.** Delete "theme defaults to light and the toggle persists dark" and update "theme choice persists from the homepage to a project page" to use the menu.
- **Add one test loop over every entry in `THEMES`.** Import them from `src/themes/registry.ts`, so tickets 2–4 are covered automatically. For each theme:
  - Open the menu (`getByRole("button", { name: "Theme" })`) and pick the option by role `menuitemradio` and name.
  - Assert that `html[data-theme]` equals the id, that `.dark` is present exactly when the scheme is dark, and that the `theme-color` meta matches.
  - Reload the page and assert the theme persists. Then navigate to `/projects/agent-tracer` and assert it is still applied.
  - Assert there are no console errors on the homepage and the project page.
  - Assert there is no horizontal overflow at 390px on the homepage.
- **First visit:** with empty storage, `data-theme` is `light`.
- **Bad stored value:** a stored value of `"bogus"` falls back to `light`.
- **Menu keyboard test:** Enter opens the menu with focus on the checked item, ArrowDown and Enter selects the next theme, and Escape closes the menu and returns focus to the trigger.
- **Observatory metrics:** the metric tiles on a case-study page still contain their real value text, using the visually hidden copy.
- **All existing tests keep passing.**

## Verification before handing off

1. **Capture a baseline first.** Before changing any code, take Playwright screenshots of `/` (top of page, projects section, footer) and `/projects/agent-tracer` at 1440×900, in Light and in Dark. Save them to the scratchpad.
2. After the work, re-capture the same shots. Light and Dark must match the baseline, except for the palette icon. Investigate any other difference.
3. Capture Observatory at 1440×900 and 1280×800 on the homepage and on two case studies: one with a screenshot and one with the AuthCore designed visual. Review them against World Observatory, running it with `pnpm dev --port 3001` in its repo, or using its screenshot at `docs/screenshots/dashboard.jpg`.
4. Run `npm run lint`, `npm run format:check`, `npm run build` and `PW_HEADLESS=true npm test`.
5. Compare the `/` "First Load JS" before and after (budget: about +6 kB gzip), and confirm the default theme makes no extra font requests.

## Out of scope

- Playground, Deep Field and Forma, which are tickets 2–4.
- Any change to content, copy, data or layout structure.
