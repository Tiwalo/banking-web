import { expect, test, type Page } from "@playwright/test";
import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import { formatPhp } from "../../lib/money";

test("the Tiwalo sign-in form fits mobile and loads its bundled design assets", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sign in to Tiwalo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await expect(page.locator("#kc-header-wrapper")).toContainText("Tiwalo");
  await expect(page.locator("#kc-header-wrapper")).toHaveCSS("color", "rgb(9, 44, 98)");
  expect(await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some(font => font.family.includes("Inter") && font.status === "loaded");
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.locator("#username").fill("unregistered-synthetic-login");
  await page.locator("#password").fill("synthetic-invalid-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText("Check your username and password and try again.")).toBeVisible();
});

async function login(page: Page, username: string, password: string | undefined) {
  await page.goto("/");
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await continueLogin(page, username, password);
}

async function continueLogin(page: Page, username: string, password: string | undefined) {
  if (!password) throw new Error("Set the local test password for " + username);
  await page.waitForURL(url => url.origin === "http://localhost:8180" && url.pathname.startsWith("/realms/tiwalo/"));
  await expect(page.getByRole("heading", { name: "Sign in to Tiwalo" })).toBeVisible();
  await expect(page.getByText("Banking simulation · Fictional funds only")).toBeVisible();
  await page.locator("#username").fill(username);
  await page.locator("#password").fill(password);
  await page.locator("#kc-login").click();
}

test("two synthetic customers read their own accounts, deny cross-owner reads, and log out", async ({ browser }) => {
  const customers = [
    { name: "demo-customer", password: process.env.W2_CUSTOMER_1_PASSWORD, id: "9e4777f9-8de5-462c-8366-9d8aa9766096" },
    { name: "demo-customer-2", password: process.env.W2_CUSTOMER_2_PASSWORD, id: "123ac732-ff1d-4828-99a5-2030d57ec6d0" },
  ];
  for (const [index, customer] of customers.entries()) {
    if (!customer.password) throw new Error("Set both local synthetic customer passwords for this live test.");
    const context = await browser.newContext({ baseURL: "http://localhost:3000" });
    try {
      const page = await context.newPage();
      await login(page, customer.name, customer.password);
      await expect(page.getByRole("heading", { name: "Your accounts" })).toBeVisible({ timeout: 30_000 });
      const accounts = page.locator('a[href^="/accounts/"]');
      const balance = page.getByRole("region", { name: "Available balance" }).locator(".money");
      await expect(balance).toHaveText(/^₱[\d,]+\.\d{2}$/);
      const expectedMinor = process.env[index === 0 ? "W3_CUSTOMER_1_MINOR" : "W3_CUSTOMER_2_MINOR"];
      const expected = expectedMinor === undefined ? await balance.innerText() : formatPhp(expectedMinor);
      await expect(balance).toHaveText(expected);
      await page.getByRole("link", { name: "Refresh balances" }).click();
      await expect(balance).toHaveText(expected);
      await expect(accounts).toHaveCount(1);
      await expect(accounts).toHaveAttribute("href", "/accounts/" + customer.id);
      await accounts.click();
      await expect(page.getByRole("heading", { name: "Account details" })).toBeVisible();
      await expect(balance).toHaveText(expected);
      const refresh = page.waitForResponse(response => response.request().isNavigationRequest() &&
        new URL(response.url()).pathname === "/accounts/" + customer.id);
      await page.getByRole("link", { name: "Refresh balance", exact: true }).click();
      expect((await refresh).headers()["cache-control"]).toContain("no-store");
      await expect(balance).toHaveText(expected);
      const hidden = await page.goto("/accounts/" + customers[1 - index].id);
      expect(hidden?.status()).toBe(404);
      await expect(page.getByRole("heading", { name: "Page not found." })).toBeVisible();
      await page.goto("/dashboard");
      const beforeLogout = await context.cookies("http://localhost:3000");
      await page.getByRole("button", { name: "Log out" }).click();
      if (new URL(page.url()).origin === "http://localhost:8180") await page.locator("#kc-logout").click();
      await expect(page.getByRole("heading", { name: "You’re signed out" })).toBeVisible();
      // A second tab or retained cookie must also lose access on the server.
      const replay = await browser.newContext({ baseURL: "http://localhost:3000" });
      try {
        await replay.addCookies(beforeLogout);
        const replayPage = await replay.newPage();
        await replayPage.goto("/dashboard");
        await expect(replayPage.getByRole("heading", { name: "Customer sign-in" })).toBeVisible();
      } finally {
        await replay.close();
      }
      await page.getByRole("link", { name: "Sign in again" }).click();
      await continueLogin(page, customer.name, customer.password);
      await expect(page.locator('a[href^="/accounts/"]')).toHaveAttribute("href", "/accounts/" + customer.id);
    } finally {
      await context.close();
    }
  }
});

test("a customer can save, reload and revise a payment review without submitting funds", async ({ page, browser }) => {
  await login(page, "demo-customer", process.env.W2_CUSTOMER_1_PASSWORD);
  await page.locator('a[href^="/accounts/"]').first().click();
  await page.getByRole("link", { name: "Send money" }).click();
  const reference = "rcp_W4_Verbatim";
  await page.getByLabel("Recipient reference").fill(reference);
  await page.getByLabel("Amount (PHP)").fill("0.01");
  await page.getByRole("button", { name: "Review payment" }).click();
  await expect(page.getByRole("heading", { name: "Review payment" })).toBeVisible({ timeout: 30_000 });
  const original = page.url();
  await page.reload();
  await expect(page.getByText("₱0.01", { exact: true })).toBeVisible();
  await expect(page.getByText(reference, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Edit payment" }).click();
  await expect(page.getByLabel("Recipient reference")).toHaveValue(reference);
  await page.getByLabel("Amount (PHP)").fill("90071992547409.93");
  await page.getByRole("button", { name: "Review payment" }).click();
  await expect(page.getByText("₱90,071,992,547,409.93", { exact: true })).toBeVisible();
  expect(page.url()).not.toBe(original);
  const other = await browser.newPage({ baseURL: "http://localhost:3000" });
  try {
    await login(other, "demo-customer-2", process.env.W2_CUSTOMER_2_PASSWORD);
    await expect(other.getByRole("heading", { name: "Your accounts" })).toBeVisible();
    await other.goto(original);
    await expect(other.getByRole("heading", { name: /Page not found|Customer access denied/ })).toBeVisible();
    await expect(other.getByText(reference, { exact: true })).toHaveCount(0);
  } finally {
    await other.close();
  }
});

test("the operator cannot open a customer account", async ({ page }) => {
  await login(page, "demo-operator", process.env.W2_OPERATOR_PASSWORD);
  await expect(page.getByRole("heading", { name: "Operations dashboard" })).toBeVisible({ timeout: 30_000 });
  await page.goto("/accounts/9e4777f9-8de5-462c-8366-9d8aa9766096");
  await expect(page.getByRole("heading", { name: "Customer access denied" })).toBeVisible();
});

test("a customer cannot open the operator lookup", async ({ page }) => {
  await login(page, "demo-customer", process.env.W2_CUSTOMER_1_PASSWORD);
  await expect(page.getByRole("heading", { name: "Your accounts" })).toBeVisible();
  await page.goto("/operations/reconciliations");
  await expect(page.getByRole("heading", { name: "Operations access denied" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Look up findings" })).toHaveCount(0);
});

test("operator explicitly looks up an empty run and pages through a populated run", async ({ page }) => {
  const empty = process.env.W5_EMPTY_RUN_ID;
  const multi = process.env.W5_MULTI_RUN_ID;
  test.skip(!empty || !multi, "Supply a known empty run and a report with more than 20 findings.");
  await login(page, "demo-operator", process.env.W2_OPERATOR_PASSWORD);
  await page.getByRole("link", { name: "Open reconciliation" }).click();
  await page.getByLabel("Run ID").fill(randomUUID());
  await page.getByRole("button", { name: "Look up findings" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("This run is unavailable. Check the run ID.");
  await page.getByLabel("Run ID").fill(empty!);
  await page.getByRole("button", { name: "Look up findings" }).click();
  await expect(page.getByRole("status")).toContainText("No findings for run");
  await page.goto("/operations/reconciliations/" + multi);
  await expect(page.getByRole("table")).toHaveCount(0);
  await page.getByRole("button", { name: "Look up findings" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await expect(page.getByRole("main").getByRole("button")).toHaveText(["Log out", "Look up findings", "Next findings"]);
  await page.setViewportSize({ width: 320, height: 760 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const accessibility = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(accessibility.violations.map(issue => issue.id)).toEqual([]);
  const first = await page.locator("tbody th").allTextContents();
  await page.getByRole("button", { name: "Next findings" }).click();
  const nextPage = page.locator("tbody th");
  await expect(nextPage.first()).toHaveText(/^…[0-9a-f]{8}$/, { timeout: 30_000 });
  await expect.poll(async () => (await nextPage.allTextContents()).some(ref => !first.includes(ref)),
    { timeout: 30_000 }).toBe(true);
});

test("an explicit synthetic one-cent payment produces a receipt and refreshes the source balance", async ({ page, context }) => {
  test.skip(process.env.W4_LIVE_CENT !== "1", "Opt in to a one-cent transfer between the two local seed accounts.");
  await login(page, "demo-customer", process.env.W2_CUSTOMER_1_PASSWORD);
  await page.locator('a[href^="/accounts/"]').first().click();
  const balance = await page.getByRole("region", { name: "Available balance" }).locator(".money").innerText();
  const before = BigInt(balance.replace(/[₱,.\s]/g, ""));
  expect(before, "Fund the first synthetic account with at least one cent before this opt-in check.").toBeGreaterThan(BigInt(0));
  await page.getByRole("link", { name: "Send money" }).click();
  await page.getByLabel("Recipient reference").fill("rcp_24bf04e6bd8b4a39bbd3c8f3a8fa1245");
  await page.getByLabel("Amount (PHP)").fill("0.01");
  await page.getByRole("button", { name: "Review payment" }).click();
  await expect(page.getByRole("heading", { name: "Review payment" })).toBeVisible();
  const other = await context.newPage();
  await other.goto(page.url());
  await Promise.all([page, other].map(async tab => {
    const submitted = tab.waitForResponse(response => response.request().method() === "POST" && response.url() === tab.url());
    await tab.getByRole("button", { name: "Submit payment" }).click();
    await (await submitted).finished();
  }));
  for (const tab of [page, other]) {
    await tab.reload();
    await expect(tab.getByRole("heading", { name: "Payment receipt" })).toBeVisible();
    await expect(tab.locator("dt", { hasText: "Current available balance" }).locator("+ dd")).toHaveText(formatPhp(String(before - BigInt(1))));
  }
  expect(await other.locator("dt", { hasText: "Transfer ID" }).locator("+ dd").innerText())
    .toBe(await page.locator("dt", { hasText: "Transfer ID" }).locator("+ dd").innerText());
  await page.getByRole("link", { name: "Look up a receipt" }).click();
  await expect(page).toHaveURL(/\/receipts\/[a-f0-9-]+$/);
  await expect(page.getByRole("heading", { name: "Payment receipt" })).toBeVisible();
  await expect(page.getByText("₱0.01", { exact: true })).toBeVisible();
});

test("expiry of the current test session requires a new sign-in", async ({ page, context }) => {
  await login(page, "demo-customer", process.env.W2_CUSTOMER_1_PASSWORD);
  await expect(page.getByRole("heading", { name: "Your accounts" })).toBeVisible();
  const session = (await context.cookies("http://localhost:3000")).find(cookie => cookie.name.endsWith(".session_token"));
  if (!session || !session.httpOnly || session.sameSite !== "Lax") throw new Error("Expected an HttpOnly SameSite=Lax session cookie");
  const token = decodeURIComponent(session.value).split(".")[0];
  const database = new Pool({ connectionString: process.env.WEB_DATABASE_URL });
  try {
    const update = await database.query('UPDATE tiwalo_web.session SET "expiresAt" = now() WHERE token = $1', [token]);
    expect(update.rowCount).toBe(1);
  } finally {
    await database.end();
  }
  await page.reload();
  await expect(page.getByText("Your session expired. Sign in again to see your accounts.")).toBeVisible();
});
