import { expect, test } from "@playwright/test";
import { receipt } from "../../design-preview/fixtures";

test("known-ID receipt lookup keeps failed searches separate from posted receipts", async ({ page }) => {
  await page.goto("/#/receipts");
  const id = page.getByLabel("Transfer ID");
  await id.fill("unknown-example");
  await page.getByRole("button", { name: "Find receipt" }).click();
  await expect(page.getByRole("alert")).toContainText("No fixture receipt");
  await id.fill(receipt.id);
  await page.getByRole("button", { name: "Find receipt" }).click();
  await expect(page.getByRole("heading", { name: "Transfer receipt" })).toBeVisible();
  await expect(page.getByText("Posted", { exact: true })).toBeVisible();
});

test("keyboard access with reduced motion retains labels and the public contract boundaries", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/#/dashboard");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("link", { name: "Transactions", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Awaiting an API contract" })).toBeVisible();
  await page.getByLabel("Preview screen").selectOption("/operations");
  const navigation = page.getByRole("navigation", { name: "Operations navigation" });
  await expect(navigation.getByRole("link", { name: "Send Money" })).toHaveCount(0);
  await navigation.getByRole("link", { name: "Investigation" }).click();
  await page.getByRole("link", { name: "Find a reconciliation run" }).click();
  await expect(page.getByLabel("Run ID", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Logout", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Signed out" })).toBeVisible();
});
