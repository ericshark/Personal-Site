import { expect, test, type Page } from "@playwright/test";
import { profile, projectKinds, projects } from "../src/data/portfolio";
import { THEMES } from "../src/themes/registry";

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
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https:\/\//,
  );
  const updatedTime = page.locator("time[datetime='2026-11']");
  await expect(updatedTime).toHaveText("November 2026");

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
    const rows = page.locator('section[aria-labelledby="projects"] ul > li');

    await expect(rows).toHaveCount(projects.length);
    await expect(rows.getByRole("heading", { level: 4 })).toHaveText(
      projects.map((p) => p.name),
    );
    await expect(
      page
        .locator('section[aria-labelledby="projects"]')
        .getByRole("heading", { level: 3 }),
    ).toHaveText(projectKinds.map((k) => k.label));

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
    const row = page
      .locator('section[aria-labelledby="projects"] ul > li')
      .first();
    const names = await row
      .getByRole("link")
      .evaluateAll((links) => links.map((a) => a.getAttribute("aria-label")));
    expect(names).toEqual([
      "Agent Tracer live site",
      "Agent Tracer on GitHub",
      "Agent Tracer case study",
    ]);
  });

  test("project links show destination screenshot previews on hover", async ({
    page,
  }) => {
    await page.goto("/");
    const rows = page.locator('section[aria-labelledby="projects"] ul > li');

    for (const [index, project] of projects.entries()) {
      const row = rows.nth(index);
      const links = row.getByRole("link");
      const previews = row.locator("[data-link-preview]");
      const expectedCount = (project.live ? 1 : 0) + (project.repo ? 1 : 0) + 1;

      await expect(links).toHaveCount(expectedCount);
      await expect(previews).toHaveCount(expectedCount);

      for (let i = 0; i < expectedCount; i++) {
        const link = links.nth(i);
        const preview = previews.nth(i);
        await expect(link).toHaveClass(/\blink-arrow\b/);
        await expect(link).toHaveClass(/\bproject-link\b/);
        await expect(preview).toContainText("Link to");
        const previewImg = preview.locator("img");
        await expectImageLoaded(previewImg);
      }
    }
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
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /^https:\/\//,
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

/** Opens the theme menu and picks a theme by its menu label. */
async function pickTheme(page: Page, label: string) {
  await page.getByRole("button", { name: "Theme" }).click();
  await page
    .getByRole("menuitemradio", { name: new RegExp(`^${label}`) })
    .click();
}

async function expectTheme(page: Page, theme: (typeof THEMES)[number]) {
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", theme.id);
  if (theme.scheme === "dark") {
    await expect(html).toHaveClass(/\bdark\b/);
  } else {
    await expect(html).not.toHaveClass(/\bdark\b/);
  }
  // Next can add a second theme-color tag after hydration; browsers use the first.
  await expect(
    page.locator('meta[name="theme-color"]').first(),
  ).toHaveAttribute("content", theme.themeColor);
}

test.describe("themes", () => {
  test("first visit uses the light theme", async ({ page }) => {
    await page.goto("/");
    await expectTheme(page, THEMES[0]);
  });

  test("an unknown saved theme falls back to light", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "bogus"));
    await page.goto("/");
    await expectTheme(page, THEMES[0]);
  });

  test("the menu lists every theme in order and marks the active one", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Theme" }).click();
    const options = page.getByRole("menuitemradio");
    await expect(options).toHaveCount(THEMES.length);
    for (const [index, theme] of THEMES.entries()) {
      await expect(options.nth(index)).toContainText(theme.label);
      await expect(options.nth(index)).toHaveAttribute(
        "aria-checked",
        String(index === 0),
      );
    }
  });

  test("the menu works from the keyboard", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Theme" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const options = page.getByRole("menuitemradio");
    await expect(options.first()).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(options.nth(1)).toBeFocused();
    await page.keyboard.press("Enter");
    await expectTheme(page, THEMES[1]);
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(options.nth(1)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  for (const theme of THEMES) {
    test(`${theme.id} applies, persists and carries to a project page`, async ({
      page,
    }) => {
      const errors = collectErrors(page);
      await page.goto("/");
      await pickTheme(page, theme.label);
      await expectTheme(page, theme);

      await page.reload();
      await expectTheme(page, theme);

      await page.goto(`/projects/${projects[0].slug}`);
      await expectTheme(page, theme);
      await page.getByRole("button", { name: "Theme" }).click();
      await expect(
        page.getByRole("menuitemradio", {
          name: new RegExp(`^${theme.label}`),
        }),
      ).toHaveAttribute("aria-checked", "true");

      expect(errors).toEqual([]);
    });

    test(`${theme.id} has no horizontal overflow at 390px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.addInitScript(
        (id) => localStorage.setItem("theme", id),
        theme.id,
      );
      await page.goto("/");
      await expectTheme(page, theme);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }

  test("observatory metrics keep their real values for screen readers", async ({
    page,
  }) => {
    await page.addInitScript(() =>
      localStorage.setItem("theme", "observatory"),
    );
    const project = projects.find((p) => p.slug === "authcore")!;
    await page.goto(`/projects/${project.slug}`);
    const metrics = page.locator('[data-ui~="cs-metric"]');
    await expect(metrics).toHaveCount(project.caseStudy.metrics.length);
    for (const [index, metric] of project.caseStudy.metrics.entries()) {
      await expect(metrics.nth(index).locator(".sr-only")).toHaveText(
        metric.value,
      );
    }
    // The count-up starts when the metrics scroll into view; the visible number
    // then lands on the real value.
    await metrics.first().scrollIntoViewIfNeeded();
    await expect(metrics.first().locator('[aria-hidden="true"]')).toHaveText(
      project.caseStudy.metrics[0].value,
    );
  });

  test("the hero headline stays readable in every theme", async ({ page }) => {
    for (const theme of THEMES) {
      await page.addInitScript(
        (id) => localStorage.setItem("theme", id),
        theme.id,
      );
      await page.goto("/");
      await expect(
        page.getByRole("heading", { level: 1 }),
      ).toHaveAccessibleName(profile.headline);
    }
  });
});

test.describe("playground theme", () => {
  const imageProjects = projects.filter((p) => p.media.type === "image");

  test("the project gallery sits above the list and navigates", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.addInitScript(() => localStorage.setItem("theme", "playground"));
    await page.goto("/");

    const gallery = page.getByRole("region", { name: "Project gallery" });
    await gallery.scrollIntoViewIfNeeded();
    await expect(gallery).toBeVisible();
    await expect(gallery.locator('[data-ui~="pg-ring-card"]')).toHaveCount(
      imageProjects.length,
    );

    const firstGroup = page.locator('[data-ui~="project-group"]').first();
    const galleryBox = await gallery.boundingBox();
    const groupBox = await firstGroup.boundingBox();
    expect(galleryBox!.y + galleryBox!.height).toBeLessThanOrEqual(groupBox!.y);

    // Hovering stops the auto-rotation, so the front card only moves on request.
    await gallery.hover();
    const name = gallery.locator('[data-ui~="pg-carousel-name"]');
    await expect(name).toHaveText(
      new RegExp(`^(${imageProjects.map((p) => p.name).join("|")})$`),
    );
    const before = await name.textContent();
    await gallery.getByRole("button", { name: "Next project" }).click();
    await expect(name).not.toHaveText(before!);

    const front = gallery.getByRole("link", { name: /^Open .+ case study$/ });
    await expect(front).toHaveCount(1);
    const href = await front.getAttribute("href");
    expect(imageProjects.map((p) => `/projects/${p.slug}`)).toContain(href);
    expect((await page.request.get(href!)).status()).toBe(200);
    expect(errors).toEqual([]);
  });

  test("the light theme has no project gallery", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('[data-ui~="project-group"]').first(),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Project gallery" }),
    ).toHaveCount(0);
  });

  test("decoded titles keep their exact text for assistive tech", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "playground"));
    await page.goto("/");
    for (const name of [
      "Projects",
      "Selected Experience",
      "Education",
      "Contact",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name, exact: true }),
      ).toHaveCount(1);
    }
    for (const project of projects) {
      await expect(
        page.getByRole("heading", {
          level: 4,
          name: project.name,
          exact: true,
        }),
      ).toHaveCount(1);
    }
    await page.goto(`/projects/${projects[1].slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      projects[1].name,
    );
  });
});

test.describe("deep field theme", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "deep-field"));
  });

  test("the distance readout follows the voyage on desktop", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const readout = page.locator('[data-ui~="df-readout"]');
    await expect(readout).toBeVisible();
    await expect(readout).toContainText("EARTH");

    await page.evaluate(() => {
      const heading = document.getElementById("projects")!;
      window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY);
    });
    await expect(readout).toContainText("MARS");
    expect(errors).toEqual([]);
  });

  test("the starfield runs only on desktop widths", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator('[data-ui~="df-starfield"]')).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('[data-ui~="df-starfield"]')).toBeHidden();
    await expect(page.locator('[data-ui~="df-readout"]')).toBeHidden();
  });

  test("case studies have no distance readout", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/projects/${projects[0].slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('[data-ui~="df-readout"]')).toHaveCount(0);
  });
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
