import { expect, test } from "@playwright/test";

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
  for (const name of ["Projects", "Selected Experience", "Contact"]) {
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

test("a featured project opens its details on the projects page", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Agent Tracer" }).click();

  await expect(page).toHaveURL(/\/projects#agent-tracer$/);
  const dialog = page.getByRole("dialog", { name: "Agent Tracer" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "View Agent Tracer on GitHub" }),
  ).toHaveAttribute("rel", "noopener noreferrer");
});

test("project filters narrow the grid and update the URL", async ({ page }) => {
  await page.goto("/projects");
  const filters = page.getByRole("group", {
    name: "Filter projects by category",
  });
  for (const name of [
    "All",
    "Interfaces",
    "Games",
    "Tools & Backends",
    "Lab",
  ]) {
    await expect(filters.getByRole("button", { name })).toBeVisible();
  }

  const cards = page.locator(".project-card");
  const total = await cards.count();
  await filters.getByRole("button", { name: /^Games/ }).click();

  await expect(page).toHaveURL(/\?category=games$/);
  await expect(filters.getByRole("button", { name: /^Games/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect.poll(() => cards.count()).toBeLessThan(total);
  for (const card of await cards.all()) {
    await expect(card).toContainText("Games");
  }
});

test("project dialog steps through projects and closes with Escape", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "AuthCore" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("AuthCore");
  await expect(page).toHaveURL(/#authcore$/);

  await page.keyboard.press("ArrowRight");
  await expect(dialog).not.toHaveAccessibleName("AuthCore");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/#/);
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
