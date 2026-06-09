# Eric Zwierzynski — Personal Site

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, Motion, and Lenis.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Edit content

All portfolio content lives in one file:

```
src/data/portfolio.ts
```

Edit `profile`, `projects`, `experience`, `earlierExperience`, `stackLine`, and `siteMeta` there — components render from this data and contain no personal content.

- **Add a project link:** set the optional `url` field on a project. Without it, the entry shows "Case study coming soon".
- **Add a resume:** drop `resume.pdf` into `public/`. The Resume link in the header appears automatically at the next build — no code change needed.

## Production build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new) — the Next.js defaults work as-is.
3. After the first deploy, set the `NEXT_PUBLIC_SITE_URL` environment variable to the deployed URL (e.g. `https://your-domain.vercel.app`) so Open Graph images resolve with absolute URLs, then redeploy.

Or from the CLI:

```bash
npx vercel
```

## Notes

- Smooth scrolling (Lenis) and entrance animations are disabled automatically when the visitor has `prefers-reduced-motion` enabled.
- Fonts are Geist Sans / Geist Mono via the `geist` package — self-hosted, no network fetch at build time.
- Tailwind is pinned to v3.4 because this machine runs Node 18 (Tailwind v4 requires Node 20+). If you upgrade Node, migrating is optional.
