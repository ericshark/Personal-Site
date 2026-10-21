# Eric Zwierzynski — Personal Site

Personal portfolio built with Next.js, TypeScript, and Tailwind CSS, with
Motion animations and Lenis scrolling. It includes projects, experience,
education, and contact links.

## Run locally

Use Node.js 22 and npm. From the project root:

```bash
npm ci
npm run dev -- --port 3001
```

Open <http://localhost:3001>. If occupied, use `--port 3002` and keep
incrementing until a port is available.

## Useful commands

- `npm run build`: build the static site into `out/`, the Netlify publish directory.
- `npm run lint`: lint the code.
- `npm run format:check`: check formatting.
- `PW_HEADLESS=true npm test`: run Playwright smoke tests against the static build;
  install Chromium first with `npx playwright install chromium`.

## How it works

- `src/data/portfolio.ts`: profile, project, experience, and education content.
- `src/app/`: page composition, layout, metadata, and global styles.
- `src/components/`: page sections, theme controls, and animation helpers.
- `public/`: static assets. Add `resume.pdf` here to enable the resume link
  on the next build.

The site is statically exported; it needs no backend or environment variables.
