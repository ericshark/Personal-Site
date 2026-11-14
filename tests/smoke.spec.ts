import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/data/portfolio";

// Vercel Analytics injects /_vercel/insights/script.js, which only exists on
// Vercel. Stub it so the static build served locally doesn't log a 404.
test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" }),
  );
});

test("home page renders every section without console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const name of [
    "Projects",
    "Selected Experience",
    "Education",
    "Contact",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("theme defaults to light and the toggle persists dark", async ({
  page,
}) => {
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: "Dark theme" });

  await page.goto("/");
  await expect(html).not.toHaveClass(/\bdark\b/);
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  await toggle.click();
  await expect(html).toHaveClass(/\bdark\b/);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  await expect(html).toHaveClass(/\bdark\b/);

  await toggle.click();
  await expect(html).not.toHaveClass(/\bdark\b/);
});

test("View projects scrolls to the projects section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View projects" }).click();

  await expect(page).toHaveURL(/#projects$/);
  await expect
    .poll(() =>
      page
        .locator("#projects")
        .evaluate((heading) => heading.getBoundingClientRect().top),
    )
    .toBeLessThan(200);
});

test("technical details disclosures open", async ({ page }) => {
  await page.goto("/");
  const summary = page.locator("summary").first();
  await summary.click();
  await expect(summary.locator("xpath=..")).toHaveAttribute("open", "");
});

test("external links open safely", async ({ page }) => {
  await page.goto("/");
  const externalLinks = page.locator('a[target="_blank"]');
  expect(await externalLinks.count()).toBeGreaterThan(0);
  for (const link of await externalLinks.all()) {
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("unknown paths show the 404 page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await expect(
    page.getByRole("heading", { name: "This page doesn’t exist." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/** Scrolls an image into view and waits until it has actually decoded. */
async function expectImageLoaded(img: ReturnType<Page["locator"]>) {
  await img.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      img.evaluate(
        (el) =>
          (el as HTMLImageElement).complete &&
          (el as HTMLImageElement).naturalWidth > 0,
      ),
    )
    .toBe(true);
}

test.describe("homepage projects", () => {
  test("lists every project in order, each with an image and the right actions", async ({
    page,
  }) => {
    await page.goto("/");
    const rows = page.locator('ul[aria-label="Projects"] > li');

    await expect(rows).toHaveCount(projects.length);
    await expect(rows.getByRole("heading", { level: 3 })).toHaveText(
      projects.map((p) => p.name),
    );

    for (const [index, project] of projects.entries()) {
      const row = rows.nth(index);

      // A screenshot with alt text, or a designed visual with a text description.
      const image = row.locator("img[alt]:not([alt=''])");
      const visual = row.getByRole("img");
      if (project.media.type === "image") {
        await expect(image).toHaveCount(1);
        await expectImageLoaded(image);
      } else {
        await expect(visual).toHaveCount(1);
        await expect(visual).toHaveAttribute("aria-label", /.+/);
        await expect(visual).toBeVisible();
      }

      await expect(
        row.getByRole("link", { name: `${project.name} case study` }),
      ).toHaveAttribute("href", `/projects/${project.slug}`);

      const live = row.getByRole("link", { name: `${project.name} live site` });
      const repo = row.getByRole("link", { name: `${project.name} on GitHub` });
      await expect(live).toHaveCount(project.live ? 1 : 0);
      await expect(repo).toHaveCount(project.repo ? 1 : 0);
      if (project.live)
        await expect(live).toHaveAttribute("href", project.live);
      if (project.repo)
        await expect(repo).toHaveAttribute("href", project.repo);
      for (const link of [live, repo]) {
        if (await link.count()) {
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
      }
    }
  });

  test("rows have exactly the action links, in keyboard order", async ({
    page,
  }) => {
    await page.goto("/");
    const row = page.locator('ul[aria-label="Projects"] > li').first();
    const names = await row
      .getByRole("link")
      .evaluateAll((links) => links.map((a) => a.getAttribute("aria-label")));
    expect(names).toEqual([
      "Agent Tracer live site",
      "Agent Tracer on GitHub",
      "Agent Tracer case study",
    ]);
  });
});

test.describe("project pages", () => {
  for (const [index, project] of projects.entries()) {
    test(`${project.slug} renders and navigates`, async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(`/projects/${project.slug}`);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        project.name,
      );
      await expect(page).toHaveTitle(new RegExp(project.name));
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /.+/,
      );

      const main = page.getByRole("main");
      if (project.media.type === "image") {
        await expectImageLoaded(main.locator("img").first());
      } else {
        await expect(main.getByRole("img").first()).toBeVisible();
      }
      for (const metric of project.caseStudy.metrics) {
        await expect(
          main.getByText(metric.label, { exact: true }),
        ).toBeVisible();
      }
      if (project.caseStudy.architecture) {
        await expect(
          main.getByRole("img", { name: /^Architecture/ }),
        ).toBeAttached();
      }
      await expect(main.locator("h3")).toHaveCount(
        project.caseStudy.decisions.length,
      );

      const previous =
        projects[(index - 1 + projects.length) % projects.length];
      const next = projects[(index + 1) % projects.length];
      await expect(
        page.getByRole("link", { name: `Previous project: ${previous.name}` }),
      ).toHaveAttribute("href", `/projects/${previous.slug}`);
      await expect(
        page.getByRole("link", { name: `Next project: ${next.name}` }),
      ).toHaveAttribute("href", `/projects/${next.slug}`);

      await page
        .getByRole("link", { name: `Next project: ${next.name}` })
        .click();
      await expect(page).toHaveURL(new RegExp(`/projects/${next.slug}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        next.name,
      );

      await page.getByRole("link", { name: "All projects" }).click();
      await expect(page).toHaveURL(/\/#projects$/);
      await expect(
        page.getByRole("heading", { level: 2, name: "Projects" }),
      ).toBeVisible();

      expect(errors).toEqual([]);
    });

    test(`${project.slug} actions match its data`, async ({ page }) => {
      await page.goto(`/projects/${project.slug}`);
      const main = page.getByRole("main");
      await expect(
        main.getByRole("link", { name: `${project.name} live site` }),
      ).toHaveCount(project.live ? 1 : 0);
      await expect(
        main.getByRole("link", { name: `${project.name} on GitHub` }),
      ).toHaveCount(project.repo ? 1 : 0);
    });
  }

  test("unknown project slugs show the 404 page", async ({ page }) => {
    await page.goto("/projects/not-a-project");
    await expect(
      page.getByRole("heading", { name: "This page doesn’t exist." }),
    ).toBeVisible();
  });
});

test("every internal link on the homepage and project pages resolves", async ({
  page,
  request,
}) => {
  const hrefs = new Set<string>();
  for (const path of ["/", ...projects.map((p) => `/projects/${p.slug}`)]) {
    await page.goto(path);
    const found = await page
      .locator("a[href^='/']")
      .evaluateAll((links) =>
        links.map((a) => a.getAttribute("href") as string),
      );
    for (const href of found) hrefs.add(href.split("#")[0] || "/");
  }

  for (const slug of projects.map((p) => p.slug)) {
    expect(hrefs).toContain(`/projects/${slug}`);
  }
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test("sitemap lists every project page", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const { slug } of projects) {
    expect(xml).toContain(`/projects/${slug}`);
  }
});

test("theme choice persists from the homepage to a project page", async ({
  page,
}) => {
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: "Dark theme" });

  await page.goto("/");
  await toggle.click();
  await expect(html).toHaveClass(/\bdark\b/);

  await page.goto(`/projects/${projects[0].slug}`);
  await expect(html).toHaveClass(/\bdark\b/);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");

  await toggle.click();
  await expect(html).not.toHaveClass(/\bdark\b/);
  await page.goto("/");
  await expect(html).not.toHaveClass(/\bdark\b/);
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ["/", ...projects.map((p) => `/projects/${p.slug}`)]) {
    test(`no horizontal overflow on ${path}`, async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(path);
      await page.waitForLoadState("load");
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      expect(errors).toEqual([]);
    });
  }
});
