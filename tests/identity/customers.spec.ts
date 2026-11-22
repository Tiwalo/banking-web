import { expect, test, type Page } from "@playwright/test";
import { Pool } from "pg";

async function login(page: Page, username: string, password: string | undefined) {
  await page.goto("/sign-in");
  await continueLogin(page, username, password);
}

async function continueLogin(page: Page, username: string, password: string | undefined) {
  if (!password) throw new Error("Set the local test password for " + username);
  await page.getByRole("button", { name: "Continue with Keycloak" }).click();
  await page.waitForURL(url => url.origin === "http://localhost:8180" && url.pathname.startsWith("/realms/tiwalo/"));
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
      await expect(accounts).toHaveCount(1);
      await expect(accounts).toHaveAttribute("href", "/accounts/" + customer.id);
      await accounts.click();
      await expect(page.getByRole("heading", { name: "Account details" })).toBeVisible();
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

test("the operator cannot open a customer account", async ({ page }) => {
  await login(page, "demo-operator", process.env.W2_OPERATOR_PASSWORD);
  await expect(page.getByRole("heading", { name: "Customer access denied" })).toBeVisible();
  await page.goto("/accounts/9e4777f9-8de5-462c-8366-9d8aa9766096");
  await expect(page.getByRole("heading", { name: "Customer access denied" })).toBeVisible();
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
