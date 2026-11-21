import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { receipt, runId } from "../../design-preview/fixtures";

async function accessible(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"]).analyze();
  expect(result.violations.map(({ id, nodes }) => [id, nodes.map(n => n.target)])).toEqual([]);
}

for (const width of [1440, 768, 390, 320]) {
  for (const [name, path] of [["customer", "/dashboard"], ["operations", "/operations"]]) {
    test(name + " dashboard at " + width, async ({ page }, info) => {
      await page.setViewportSize({ width, height: width === 1440 ? 960 : 844 });
      await page.goto("/#" + path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByText("Design preview · synthetic data", { exact: true })).toBeVisible();
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await accessible(page);
      await page.screenshot({ path: info.outputPath(name + "-" + width + ".png"), fullPage: true });
    });
  }
}

for (const [name, path, heading] of [
  ["review", "/transfers/review", "Review transfer"], ["unknown", "/transfers/pending", "Transfer outcome unknown"],
  ["receipt", "/receipts/" + receipt.id, "Transfer receipt"], ["findings", "/operations/reconciliations/" + runId, "Reconciliation findings"],
]) {
  test(name + " fixture and screenshots", async ({ page }, info) => {
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/#" + path);
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await accessible(page);
      await page.screenshot({ path: info.outputPath(name + "-" + width + ".png"), fullPage: true });
    }
    await page.emulateMedia({ media: "print" });
    await expect(page.getByText("Design preview · synthetic data", { exact: true })).toBeVisible();
    if (name === "receipt") {
      await expect(page.getByRole("button", { name: "Print receipt" })).toBeHidden();
      await page.screenshot({ path: info.outputPath("receipt-print.png"), fullPage: true });
    }
  });
}

test("drawer confines focus, closes with Escape and keeps role navigation separate", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/dashboard");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Reconciliation" })).toHaveCount(0);
  await dialog.getByRole("link", { name: "Logout" }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await dialog.getByRole("link", { name: "Accounts", exact: true }).click();
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByRole("heading", { name: "Accounts", exact: true })).toBeVisible();
});

test("transfer preserves reviewed details and submit has no financial side effects", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", req => { if (req.method() !== "GET" || new URL(req.url()).pathname.startsWith("/api/")) requests.push(req.url()); });
  await page.goto("/#/transfers/new");
  await page.getByLabel("Amount (PHP)").fill("0");
  await page.getByRole("button", { name: "Review transfer" }).click();
  await expect(page.getByRole("alert")).toContainText("positive PHP amount");
  await page.getByLabel("Recipient reference").fill("MiXed-07");
  await page.getByLabel("Amount (PHP)").fill("0.01");
  await page.getByRole("button", { name: "Review transfer" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByText("MiXed-07")).toBeVisible();
  await expect(page.getByText("₱0.01")).toBeVisible();
  await page.getByRole("button", { name: "Submit preview" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByRole("heading", { name: "Submitting transfer" })).toBeVisible();
  await expect(page.getByText("Posted", { exact: true })).toHaveCount(0);
  await page.getByLabel("Preview screen").selectOption("/transfers/pending");
  await expect(page.getByRole("status")).toContainText("can complete that original payment");
  await page.getByRole("button", { name: "Review same-key retry" }).click();
  await page.getByRole("button", { name: "Preview identical retry" }).click();
  await expect(page.getByRole("status")).toContainText("outcome remains unknown");
  await expect(page.getByText("Posted", { exact: true })).toHaveCount(0);
  await page.getByLabel("Preview screen").selectOption("/transfers/declined");
  await expect(page.getByRole("status")).toContainText("Insufficient funds");
  expect(requests).toEqual([]);
});

test("data variants and explicit operator lookup and paging", async ({ page }) => {
  await page.goto("/#/dashboard");
  for (const [state, message] of [["Loading", "Loading account"], ["Empty", "No accounts"], ["Unavailable", "could not be loaded"]]) {
    await page.getByLabel("Data state").selectOption(state);
    await expect(page.getByRole("status")).toContainText(message);
  }
  await page.getByLabel("Preview screen").selectOption("/operations");
  await page.getByLabel("Run ID", { exact: true }).fill(runId);
  await page.getByRole("button", { name: "View findings" }).click();
  await expect(page.getByRole("table")).toContainText("Balance mismatch");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("table")).toContainText("Missing posting audit");
  for (const state of ["Empty", "Denied", "Unavailable"]) {
    await page.getByLabel("Data state").selectOption(state);
    await expect(page.getByRole("table")).toHaveCount(0);
    await expect(page.getByRole("status")).toBeVisible();
  }
});
