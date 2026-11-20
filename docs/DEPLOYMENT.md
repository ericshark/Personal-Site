# Deployment

## Overview

|                 |                                                                     |
| --------------- | ------------------------------------------------------------------- |
| Application     | Eric Zwierzynski — Personal Site (`personal-website`)               |
| Status          | Live                                                                |
| Production URL  | https://ericzwierzynski.dev                                         |
| Redirect domain | https://www.ericzwierzynski.dev (308 → https://ericzwierzynski.dev) |
| Hosting         | Vercel (`main-site`)                                                |
| Repository      | https://github.com/ericshark/Personal-Site (`main` branch)          |

## Architecture

`Browser → Vercel CDN (static export from Next.js out/)`

The application uses Next.js with `output: "export"` (`next.config.mjs`) to generate a static site in `out/`. There is no backend or database. Vercel Web Analytics is enabled via `@vercel/analytics`.

## Deployment Workflow

- Pushing to `main` on `ericshark/Personal-Site` triggers a Vercel production deployment.
- `vercel.json` sets `Content-Type: image/png` on the extensionless `/opengraph-image` route and permanently redirects `www.ericzwierzynski.dev` to `https://ericzwierzynski.dev`.
- Custom domains `ericzwierzynski.dev` and `www.ericzwierzynski.dev` use DNS-only Cloudflare CNAME records pointing to Vercel.

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional): defaults to `https://ericzwierzynski.dev` in `src/data/portfolio.ts` for canonical links, sitemap, and Open Graph metadata.
- Project screenshots and link-preview thumbnails are pre-encoded to AVIF and WebP via `npm run screenshots` (`scripts/capture-projects.mjs`).

## Maintenance

- Run `npm run lint`, `npm run format:check`, and `PW_HEADLESS=true npm test` before releasing changes.
- To refresh project screenshots or link previews after updating `src/data/portfolio.ts`:
  - `npm run screenshots -- --only <slug>` to recapture a project's live screenshot.
  - `npm run build && npm run screenshots -- --previews --force` to recapture and encode link hover previews.
