import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    recordPolicyViolation: (directive: string) => Promise<void>;
  }
}

test("serves the production page with a fresh, enforced script nonce", async ({ page }) => {
  const violations: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.exposeFunction("recordPolicyViolation", (directive: string) => violations.push(directive));
  await page.addInitScript(() => {
    window.addEventListener("securitypolicyviolation", event => {
      void window.recordPolicyViolation(event.effectiveDirective);
    });
  });

  const nonces: string[] = [];
  for (let visit = 0; visit < 2; visit++) {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    const headers = response!.headers();
    const policy = headers["content-security-policy"];
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("form-action 'self'");
    expect(policy).not.toMatch(/unsafe-inline|unsafe-eval/);
    expect(headers["cache-control"]).toContain("no-store");
    expect(headers["referrer-policy"]).toBe("no-referrer");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    const nonce = /'nonce-([^']+)'/.exec(policy)?.[1];
    expect(nonce).toBeTruthy();
    const scriptNonces = await page.locator("script[src]").evaluateAll(scripts =>
      scripts.map(script => (script as HTMLScriptElement).nonce)
    );
    expect(scriptNonces.length).toBeGreaterThan(0);
    expect(new Set(scriptNonces)).toEqual(new Set([nonce]));
    nonces.push(nonce!);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Philippine banking");
  }
  expect(new Set(nonces).size).toBe(2);
  expect(violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("supports the keyboard and reflows at 320 CSS pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("link", { name: "About the simulation" }).click();
  await expect(page).toHaveURL(/#about$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await expect.poll(() => page.getByRole("img").evaluate(image =>
    (image as HTMLImageElement).naturalWidth
  )).toBeGreaterThan(0);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("a missing URL returns 404 and its home link works", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found." })).toBeVisible();
  const originalDocument = await page.evaluateHandle(() => document);
  await page.getByRole("link", { name: "Return home" }).click();
  await expect(page).toHaveURL(/\/$/);
  // A hydrated Next link navigates without replacing the document.
  expect(await originalDocument.evaluate(previous => previous === document)).toBe(true);
  await originalDocument.dispose();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Philippine banking");
});

test("applies the document policy to the HTML returned for a missing asset URL", async ({ request }) => {
  const response = await request.get("/images/missing.webp");
  expect(response.status()).toBe(404);
  expect(response.headers()["content-type"]).toContain("text/html");
  expect(response.headers()["content-security-policy"]).toMatch(/script-src[^;]*'nonce-[^']+'/);
  expect(response.headers()["cache-control"]).toContain("no-store");

  const image = await request.get("/images/terraces-720.webp");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/webp");
  expect(image.headers()["cache-control"]).not.toContain("no-store");
});
