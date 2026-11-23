import { expect, test, vi } from "vitest";
import { chromium, type Page } from "playwright";
import { auth, webDatabase } from "../../lib/auth/server";
import { readDraft, submitDraft } from "../../lib/transfers/drafts";
import { createCustomerApi } from "../../lib/api/client";
import { isTransferReceipt } from "../../lib/api/generated/validate.cjs";
import { formatPhp } from "../../lib/money";

// This integration runner executes the server modules directly on Node.
vi.mock("server-only", () => ({}));

const origin = "http://localhost:3000";
const sourceId = "9e4777f9-8de5-462c-8366-9d8aa9766096";
const recipient = "rcp_24bf04e6bd8b4a39bbd3c8f3a8fa1245";

async function signIn(page: Page) {
  await page.goto(origin);
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await page.waitForURL(url => url.origin === "http://localhost:8180" && url.pathname.startsWith("/realms/tiwalo/"));
  await page.locator("#username").fill("demo-customer");
  await page.locator("#password").fill(process.env.W2_CUSTOMER_1_PASSWORD!);
  await page.locator("#kc-login").click();
  await page.waitForURL(origin + "/dashboard");
}

test("recovers the original Spring posting after losing its response and signing in again", async () => {
  if (process.env.W4_LIVE_RECOVERY !== "1") throw new Error("Set W4_LIVE_RECOVERY=1 to spend one fictional cent.");
  expect(process.env.APP_ORIGIN).toBe(origin);
  expect(process.env.BANKING_API_BASE_URL).toBe("http://localhost:8081/api/v1");
  if (!process.env.W2_CUSTOMER_1_PASSWORD) throw new Error("Set the local synthetic customer password.");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await signIn(page);
    await page.locator('a[href="/accounts/' + sourceId + '"]').click();
    const displayed = await page.getByRole("region", { name: "Available balance" }).locator(".money").innerText();
    const before = BigInt(displayed.replace(/[₱,.\s]/g, ""));
    expect(before).toBeGreaterThan(BigInt(0));
    await page.getByRole("link", { name: "Send money" }).click();
    await page.getByLabel("Recipient reference").fill(recipient);
    await page.getByLabel("Amount (PHP)").fill("0.01");
    await page.getByRole("button", { name: "Review payment" }).click();
    await page.waitForURL("**/transfers/review/*");
    const review = new URL(page.url());
    const draftId = review.pathname.split("/").at(-1)!;
    const cookies = await page.context().cookies(origin);
    const headers = new Headers({ cookie: cookies.map(c => c.name + "=" + c.value).join("; ") });
    const identity = auth().api;
    const session = await identity.getSession({ headers });
    if (!session) throw new Error("Expected an authenticated customer.");
    const provider = (await identity.listUserAccounts({ headers })).find(a => a.providerId === "keycloak");
    if (!provider) throw new Error("Missing Keycloak identity.");
    const { accessToken } = await identity.getAccessToken({ headers, body: { accountId: provider.id } });
    const actor = session.user.id;
    const draft = await readDraft(actor, draftId);
    if (!draft || draft.state !== "review") throw new Error("Expected an unsent draft.");
    let originalId: string | undefined;
    let initialKeyMatched = false;
    const api = createCustomerApi({ accessToken, fetch: async request => {
      initialKeyMatched = request.headers.get("Idempotency-Key") === draft.key;
      const response = await fetch(request);
      const receipt: unknown = await response.json();
      if (response.status === 201 && isTransferReceipt(receipt) && receipt && typeof receipt === "object" &&
          "transferId" in receipt && typeof receipt.transferId === "string") originalId = receipt.transferId;
      // Consume the real response at the transport boundary. The BFF never receives it.
      throw new TypeError("Simulated connection loss after the upstream response");
    } });
    await submitDraft(actor, draftId, false, api.createTransfer);
    expect(initialKeyMatched).toBe(true);
    expect(originalId).toBeDefined();
    expect((await readDraft(actor, draftId))?.state).toBe("uncertain");
    await page.reload();
    await page.getByRole("heading", { name: "Payment outcome unconfirmed" }).waitFor();
    await page.goto(origin + "/dashboard");
    await page.getByRole("button", { name: "Log out" }).click();
    if (new URL(page.url()).origin === "http://localhost:8180") await page.locator("#kc-logout").click();
    await page.getByRole("heading", { name: "You’re signed out" }).waitFor();
    await page.context().close();

    const fresh = await browser.newPage();
    await signIn(fresh);
    await fresh.locator('a[href="' + review.pathname + '"]').click();
    await fresh.getByRole("heading", { name: "Payment outcome unconfirmed" }).waitFor();
    await fresh.getByRole("button", { name: "Retry original payment" }).click();
    await fresh.getByRole("heading", { name: "Payment receipt" }).waitFor();
    const recovered = await readDraft(actor, draftId);
    expect(recovered?.key === draft.key).toBe(true);
    expect(recovered?.receipt?.transferId).toBe(originalId);
    expect(await fresh.locator("dt", { hasText: "Current available balance" }).locator("+ dd").innerText())
      .toBe(formatPhp(String(before - BigInt(1))));
    await fresh.getByRole("link", { name: "Look up a receipt" }).click();
    await fresh.waitForURL(origin + "/receipts/" + originalId);
    await fresh.getByText(originalId!, { exact: true }).waitFor();
  } finally {
    await browser.close();
    await webDatabase().end();
  }
});
