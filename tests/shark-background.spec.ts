import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("desktop sharks animate and follow the theme without blocking navigation", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.goto("/");
  const canvas = page.locator("canvas.shark-background");
  await expect(canvas).toHaveJSProperty("width", 1440);
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  await page.clock.runFor(100);

  const firstFrame = await canvas.evaluate((element: HTMLCanvasElement) =>
    element.toDataURL(),
  );
  await page.clock.runFor(1000);
  expect(
    await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()),
  ).not.toBe(firstFrame);

  const brightestPixel = () =>
    canvas.evaluate((element: HTMLCanvasElement) => {
      const pixels = element
        .getContext("2d")!
        .getImageData(0, 0, element.width, element.height).data;
      let brightest = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] > 80) {
          brightest = Math.max(brightest, pixels[index]);
        }
      }
      return brightest;
    });

  const lightPixel = await brightestPixel();
  expect(lightPixel).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Dark theme" }).click();
  await page.clock.runFor(100);
  expect(await brightestPixel()).toBeGreaterThan(lightPixel);

  await page.getByRole("link", { name: "View projects" }).click();
  await page.clock.runFor(1500);
  await expect(page).toHaveURL(/#projects$/);
  const headerBounds = await page.locator("header").boundingBox();
  expect(headerBounds?.y).toBeCloseTo(0, 0);
  await page.locator("summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
});

test("the entire content column occludes the background, including the footer", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.goto("/");
  const canvas = page.locator("canvas.shark-background");
  await expect(canvas).toHaveJSProperty("width", 1440);

  for (const target of [
    "main > section",
    "#projects",
    "#experience",
    "#education",
    "#contact",
    "footer > p",
  ]) {
    await page
      .locator(target)
      .first()
      .evaluate((element) => {
        window.scrollTo(
          0,
          element.getBoundingClientRect().top + window.scrollY,
        );
      });
    await page.clock.runFor(4000);
    const clip = { x: 336, y: 0, width: 768, height: 900 };
    const before = await page.screenshot({ clip, animations: "disabled" });

    // An opaque diagnostic fill catches even small gaps in the center surface.
    await canvas.evaluate((element: HTMLCanvasElement) => {
      const context = element.getContext("2d")!;
      context.fillStyle = "#ff00ff";
      context.fillRect(0, 0, element.width, element.height);
    });
    expect(await page.screenshot({ clip, animations: "disabled" })).toEqual(
      before,
    );
  }
});

test("mobile releases the canvas and desktop resumes after resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const canvas = page.locator("canvas.shark-background");
  await expect(canvas).toBeHidden();
  await expect(canvas).toHaveJSProperty("width", 0);
  await expect(canvas).toHaveJSProperty("height", 0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveJSProperty("width", 1024);
  await page.setViewportSize({ width: 1023, height: 900 });
  await expect(canvas).toBeHidden();
  await expect(canvas).toHaveJSProperty("width", 0);
});

test("high density screens cap the canvas backing store at twice the viewport", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 3,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const canvas = page.locator("canvas.shark-background");
    await expect(canvas).toHaveJSProperty("width", 2880);
    await expect(canvas).toHaveJSProperty("height", 1800);
  } finally {
    await context.close();
  }
});

test("content remains usable when a canvas context is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  await page.getByRole("link", { name: "View projects" }).click();
  await expect(page).toHaveURL(/#projects$/);
});
