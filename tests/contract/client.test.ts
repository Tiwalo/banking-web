// @vitest-environment node
import { describe, expect, expectTypeOf, test, vi } from "vitest";
import { createCustomerApi, createOperatorApi } from "../../lib/api/client";
import type { operations } from "../../lib/api/generated/banking";
import type { ApiResult } from "../../lib/api/problem";
import { account, findings, page, problem, receipt, transfer } from "./fixtures";

// Next enforces this import at the client/server boundary. This suite executes in Node.
vi.mock("server-only", () => ({}));
const baseUrl = "https://banking.example.invalid/api/v1";
const key = "synthetic-attempt_01";
const location = "/api/v1/transfers/" + receipt.transferId;

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers });
}
function fault(status: number, code: string) {
  return json(problem(status, code), status, { "content-type": "application/problem+json; charset=utf-8" });
}
function harness(reply: () => Response | Promise<Response>) {
  const fetch = vi.fn<(request: Request) => Promise<Response>>(async () => reply());
  const config = { accessToken: "synthetic-token", baseUrl, fetch };
  return { customer: createCustomerApi(config), operator: createOperatorApi(config), fetch };
}

describe("contract transport", () => {
  test("lists owned accounts, preserves exact money strings and encodes opaque cursors", async () => {
    const { customer, fetch } = harness(() => json(page));
    const result = await customer.listAccounts({ limit: 1, cursor: page.nextCursor });
    type AccountsPage = operations["listAccounts"]["responses"][200]["content"]["application/json"];
    expectTypeOf(result).toEqualTypeOf<ApiResult<AccountsPage>>();
    expect(result).toEqual({ ok: true, data: page });
    const request = fetch.mock.calls[0][0];
    const url = new URL(request.url);
    expect(url.origin + url.pathname).toBe(baseUrl + "/accounts");
    expect(url.searchParams.get("cursor")).toBe(page.nextCursor);
    expect(url.searchParams.get("limit")).toBe("1");
    expect(request.headers.get("Authorization")).toBe("Bearer synthetic-token");
    expect(request.cache).toBe("no-store");
    expect(request.redirect).toBe("error");
    expect(request.credentials).toBe("omit");
    expect(await harness(() => json({ accounts: [] })).customer.listAccounts()).toEqual({ ok: true, data: { accounts: [] } });
  });

  test("checks the response against both schema and requested resource", async () => {
    expect(await harness(() => json(account)).customer.getAccount(account.accountId)).toEqual({ ok: true, data: account });
    expect(await harness(() => json(receipt)).customer.getReceipt(receipt.transferId)).toEqual({ ok: true, data: receipt });
    expect(await harness(() => json(receipt)).customer.getReceipt(account.accountId)).toMatchObject({ kind: "invalid-response" });
    for (const value of [500000, "9223372036854775808", "1.23"]) {
      expect(await harness(() => json({ ...account, availableBalanceMinor: value })).customer.getAccount(account.accountId))
        .toMatchObject({ ok: false, kind: "invalid-response" });
    }
    const { customer, fetch } = harness(() => json({}));
    expect(await customer.getAccount("../operations")).toMatchObject({ kind: "invalid-request" });
    expect(fetch).not.toHaveBeenCalled();
  });

  test("operator adapter offers only an explicit, paginated findings read", async () => {
    const { customer, operator, fetch } = harness(() => json(findings));
    expect(Object.keys(operator)).toEqual(["listFindings"]);
    expect(customer).not.toHaveProperty("listFindings");
    expect(fetch).not.toHaveBeenCalled();
    expect(await operator.listFindings(findings.runId, { limit: 1, cursor: findings.nextCursor })).toEqual({ ok: true, data: findings });
    const request = fetch.mock.calls[0][0];
    expect(request.method).toBe("GET");
    expect(new URL(request.url).pathname).toBe("/api/v1/operations/reconciliations/" + findings.runId + "/findings");
    expect(new URL(request.url).searchParams.get("cursor")).toBe(findings.nextCursor);
    expect(await operator.listFindings(account.accountId)).toMatchObject({ kind: "invalid-response" });
  });

  test.each([[400, "INVALID_REQUEST", "invalid-request"], [401, "UNAUTHORIZED", "unauthenticated"],
    [403, "FORBIDDEN", "forbidden"], [404, "NOT_FOUND", "not-found"], [500, "INTERNAL_ERROR", "unavailable"]] as const)(
    "normalizes HTTP %i without exposing raw backend details", async (status, code, kind) => {
      const result = await harness(() => fault(status, code)).customer.getAccount(account.accountId);
      expect(result).toMatchObject({ ok: false, status, kind });
      expect(JSON.stringify(result)).not.toMatch(/synthetic-token|Upstream diagnostic|Synthetic upstream title/);
    });

  test("rejects an unsafe server configuration before sending credentials", () => {
    for (const url of ["http://banking.example/api/v1", baseUrl + "?token=x", "https://user@example.com/api/v1", "https://example.com"]) {
      expect(() => createCustomerApi({ accessToken: "test", baseUrl: url })).toThrow();
    }
  });
});

describe("transfer contract using injected fetch only", () => {
  test("forwards the caller's key once per explicit call and accepts the same verified receipt on replay", async () => {
    const { customer, fetch } = harness(() => json(receipt, 201, { location }));
    for (let i = 0; i < 2; i++) {
      expect(await customer.createTransfer(transfer, key)).toEqual({ ok: true, data: receipt });
      const request = fetch.mock.calls[i][0];
      expect(request.url).toBe(baseUrl + "/transfers");
      expect(request.method).toBe("POST");
      expect(request.headers.get("Idempotency-Key")).toBe(key);
      expect(await request.json()).toEqual(transfer);
    }
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("accepts an equivalent same-origin absolute receipt Location", async () => {
    const { customer } = harness(() => json(receipt, 201, { location: "https://banking.example.invalid" + location }));
    expect(await customer.createTransfer(transfer, key)).toEqual({ ok: true, data: receipt });
  });

  test.each([
    [409, "IDEMPOTENCY_CONFLICT", "idempotency-conflict"],
    [422, "INSUFFICIENT_FUNDS", "insufficient-funds"], [422, "TRANSFER_LIMIT_EXCEEDED", "transfer-limit"],
    [422, "SAME_ACCOUNT", "same-account"], [422, "ACCOUNT_UNAVAILABLE", "account-unavailable"],
    [503, "TRANSFER_BUSY", "unknown-outcome"], [422, "UNRECOGNIZED", "unknown-outcome"],
  ] as const)("maps %i %s and never retries implicitly", async (status, code, kind) => {
    const { customer, fetch } = harness(() => fault(status, code));
    expect(await customer.createTransfer(transfer, key)).toMatchObject({ ok: false, status, kind });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("leaves lost, malformed, mismatched and uncontracted responses unresolved", async () => {
    const replies = [
      () => { throw new TypeError("connection lost"); }, () => json(receipt, 200), () => json(receipt, 201),
      () => json(receipt, 201, { location: "/unrelated" }),
      () => json(receipt, 201, { location: "https://other.example.invalid" + location }),
      () => json({ ...receipt, amountMinor: "1" }, 201, { location }),
      () => json({ ...receipt, recipientReference: transfer.recipientReference.toLowerCase() }, 201, { location }),
      () => json({ ...receipt, status: "PENDING" }, 201, { location }),
      () => json(problem(422, "INSUFFICIENT_FUNDS"), 422),
      () => json(problem(400, "INSUFFICIENT_FUNDS"), 422, { "content-type": "application/problem+json" }),
      () => new Response("{", { status: 201, headers: { "content-type": "application/json" } }),
    ];
    for (const reply of replies) {
      const { customer, fetch } = harness(reply);
      expect(await customer.createTransfer(transfer, key)).toMatchObject({ ok: false, kind: "unknown-outcome" });
      expect(fetch).toHaveBeenCalledTimes(1);
    }
  });

  test("invalid keys and out-of-range amounts never dispatch", async () => {
    const { customer, fetch } = harness(() => json(receipt));
    expect(await customer.createTransfer(transfer, "")).toMatchObject({ kind: "invalid-request" });
    for (const amountMinor of ["0", "01", "1.01", "9223372036854775808"]) {
      expect(await customer.createTransfer({ ...transfer, amountMinor }, key)).toMatchObject({ kind: "invalid-request" });
    }
    expect(fetch).not.toHaveBeenCalled();
  });
});
