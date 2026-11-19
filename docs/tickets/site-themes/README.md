---
title: Site themes — overview and shared decisions
status: ready-for-agent
created: 2026-11-19
---

# Site themes

A palette button in the header replaces the moon/sun toggle. It opens a menu of whole-site themes. Every theme keeps the **same layout, content and structure** on the homepage and the case-study pages. What changes is the palette, the typography, the surface treatment, the background and the motion.

| #   | Ticket                                                                             | Adds to the menu         | Inspired by                              |
| --- | ---------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------- |
| 1   | [01-theme-foundation-menu-observatory.md](01-theme-foundation-menu-observatory.md) | Light, Dark, Observatory | `~/GitHub/interactive/world-observatory` |
| 2   | [02-playground-theme.md](02-playground-theme.md)                                   | Playground               | `~/GitHub/design/interaction-playground` |
| 3   | [03-deep-field-theme.md](03-deep-field-theme.md)                                   | Deep Field               | `~/GitHub/design/journey-through-space`  |
| 4   | [04-forma-theme.md](04-forma-theme.md)                                             | Forma                    | `~/GitHub/design/liquid-sculpture`       |

Tickets run in order. Ticket 1 builds the theme system that tickets 2–4 plug into. After each ticket, the owner runs `npm run dev`, picks the new theme from the menu, and reviews the homepage and a case-study page.

## Shared decisions (apply to every ticket)

- **First visit is always Light.** It matches today's default, and the system color scheme is still ignored. The menu remembers the visitor's choice in `localStorage` under the existing `theme` key. Existing saved values `"light"` and `"dark"` keep working.
- **One flat list, in this order:** Light, Dark, Observatory, Playground, Deep Field, Forma. Each theme has one fixed color scheme:
  - Playground is a light theme.
  - Observatory, Deep Field and Forma are dark themes.
  - No theme has light and dark variants.
- **Desktop first.** Design and polish at 1440×900 and 1280×800. Phones get the bare minimum:
  - The menu must be usable.
  - There is no horizontal scroll at 390px.
  - Text stays readable.
  - Canvas backgrounds are off below 1024px wide, matching the existing jellyfish behaviour.
- **No sound,** in any theme.
- **Motion always plays.** Follow `CLAUDE.md`. Never add `prefers-reduced-motion` handling, `useReducedMotion`, `motion-safe:`/`motion-reduce:`, or `MotionConfig reducedMotion`. When porting CSS from the source projects, **delete** their `@media (prefers-reduced-motion)` blocks.
- **Light and Dark must look exactly as they do today.** The palette button is the only visible change.
- **Content is never hidden by a theme.** Screen readers always get the real text. Scrambled, typed or decoded text sits in `aria-hidden` spans next to a visually hidden copy of the real text, following the `SplitWords` pattern.
- **Contrast.** Body and label text must stay at or above 4.5:1 against its background in every theme.
- **Default-theme cost stays near zero.** Code for theme backgrounds and effects is loaded only when that theme is active, and theme fonts download only when that theme renders text. The `/` route's "First Load JS" in `next build` output may grow by at most about 6 kB gzip for the menu and registry.
- **Static export stays** (`output: "export"`). Everything is client-side.
- **Design craft.** Load the `frontend-design` skill when building each theme's look.

## Font licensing

`interaction-playground/public/asset-sources.json` shows that **Die Grotesk** and **STK Bureau Serif** were downloaded from abilshr.com. They are commercial fonts that this site is not licensed to redistribute, so **do not copy those files**. Ticket 2 uses free substitutes instead.

Fonts in use, all OFL or free:

- Chakra Petch
- Geist and Geist Mono (already used)
- Newsreader
- Schibsted Grotesk
- Departure Mono
- JetBrains Mono
- Instrument Serif

If the owner later buys licenses for the originals, changing one theme's font variables swaps them in.

## Out of scope for all tickets

- The OG image and the resume PDF stay as they are.
- Analytics events for theme changes.
- Remembering the theme across devices.
- Light or dark variants of the new themes.
- Sound.
