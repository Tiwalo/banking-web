import { expect, test } from "@playwright/test";

test("signing in again loads the document policy for the Keycloak form", async ({ page }) => {
  await page.route("**/sign-in/start", route => route.fulfill({ status: 200, contentType: "text/html", body: "Sign-in started" }));
  await page.goto("/signed-out");
  const navigation = page.waitForResponse(response =>
    response.request().isNavigationRequest() && new URL(response.url()).pathname === "/sign-in");
  await page.getByRole("link", { name: "Sign in again" }).click();
  expect((await navigation).headers()["referrer-policy"]).toBe("same-origin");
  await expect(page.getByText("Sign-in started")).toBeVisible();
});

test("anonymous account reads lead to customer sign-in", async ({ page }) => {
  await page.route("**/sign-in/start", route => route.fulfill({ status: 200, contentType: "text/html", body: "Customer sign-in started" }));
  await page.goto("/dashboard");
  await expect(page.getByText("Customer sign-in started")).toBeVisible();
  await page.goto("/accounts/9e4777f9-8de5-462c-8366-9d8aa9766096");
  await expect(page.getByText("Customer sign-in started")).toBeVisible();
});

test("protected transfer, receipt and operator pages require sign-in and prevent shared caching", async ({ page }) => {
  const id = "00000000-0000-4000-8000-000000000001";
  // Disable only the sign-in handoff so the test can observe the actual redirect destination.
  await page.route("**/sign-in/start", route => route.fulfill({ status: 200, body: "Sign-in required" }));
  for (const path of [
    `/accounts/${id}/send`, `/transfers/review/${id}`, "/receipts", `/receipts/${id}`,
    "/operations", "/operations/reconciliations", `/operations/reconciliations/${id}`,
  ]) {
    const initial = page.waitForResponse(response =>
      response.request().isNavigationRequest() && new URL(response.url()).pathname === path);
    await page.goto(path);
    const cache = (await initial).headers()["cache-control"] ?? "";
    expect(cache, path).toContain("private");
    expect(cache, path).toContain("no-store");
    await expect(page.getByText("Sign-in required", { exact: true })).toBeVisible();
  }
});

test("rejects cross-origin sign-in and logout before contacting the provider", async ({ request }) => {
  for (const path of ["/sign-in/start", "/logout"]) {
    const response = await request.post(path, { headers: { Origin: "https://untrusted.invalid" } });
    expect(response.status()).toBe(403);
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
});
