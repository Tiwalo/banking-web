import { expect, test } from "@playwright/test";

test("anonymous account reads lead to customer sign-in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Customer sign-in" })).toBeVisible();
  await page.goto("/accounts/9e4777f9-8de5-462c-8366-9d8aa9766096");
  await expect(page.getByRole("button", { name: "Continue with Keycloak" })).toBeVisible();
});

test("rejects cross-origin sign-in and logout before contacting the provider", async ({ request }) => {
  for (const path of ["/sign-in/start", "/logout"]) {
    const response = await request.post(path, { headers: { Origin: "https://untrusted.invalid" } });
    expect(response.status()).toBe(403);
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
});
