import { expect, test } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

test("design and contract fixtures and protected destinations are absent from the public app", async ({ request }) => {
  for (const route of ["/design-preview/", "/design-preview/main.tsx", "/dashboard", "/transfers/review", "/receipts", "/operations", "/operations/reconciliations"]) {
    const res = await request.get(route);
    expect(res.status(), route).toBe(404);
    expect(res.headers()["content-security-policy"]).toContain("'nonce-");
  }
  const directory = path.resolve(".next/static");
  const assets = (await readdir(directory, { recursive: true })).filter(file => /\.(?:js|css|map)$/.test(file));
  expect(assets.length).toBeGreaterThan(0);
  for (const file of assets) {
    expect(await readFile(path.join(directory, file), "utf8"), file).not.toMatch(/W0-FIXTURE-|Design preview · synthetic data|rcp_SYNTHETIC-/);
  }
});

test("public Inter loads from the production origin", async ({ page }) => {
  const fonts: string[] = [];
  page.on("response", response => { if (response.request().resourceType() === "font" && response.ok()) fonts.push(response.url()); });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  expect(await page.evaluate(() => [...document.fonts].some(f => f.family.includes("Inter") && f.status === "loaded"))).toBe(true);
  expect(fonts.length).toBeGreaterThan(0);
  for (const url of fonts) expect(new URL(url).origin).toBe(new URL(page.url()).origin);
});
