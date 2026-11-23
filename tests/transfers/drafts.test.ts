// @vitest-environment node
import { randomUUID } from "node:crypto";
import { expect, it, vi } from "vitest";
import { readDraft, saveDraft, submitDraft, type Payment } from "../../lib/transfers/drafts";
import { failure } from "../../lib/api/problem";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("../../lib/auth/server", () => ({ required: () => "fixture-secret", webDatabase: () => ({ query }) }));

it("recovers one encrypted key for identical submissions and rejects changes to the saved payment", async () => {
  const id = randomUUID();
  const payment: Payment = { sourceAccountId: randomUUID(), recipientReference: "  rcp_CaseSensitive  ", amountMinor: "1", currency: "PHP" };
  let sealed: Buffer;
  query.mockImplementation(async (sql: string, params: unknown[]) => {
    if (sql.startsWith("INSERT")) {
      if (sealed) return { rowCount: 0 };
      sealed = params[2] as Buffer;
      return { rowCount: 1 };
    }
    if (sql.startsWith("SELECT")) return { rows: [{ sealed }] };
    return {};
  });
  expect(await saveDraft("owner", id, payment)).toBe(true);
  const first = await readDraft("owner", id);
  expect(first?.payment).toEqual(payment);
  expect(first?.key).toMatch(/^[a-f0-9-]{36}$/);
  expect(await saveDraft("owner", id, payment)).toBe(true);
  expect((await readDraft("owner", id))?.key).toBe(first?.key);
  expect(await saveDraft("owner", id, { ...payment, amountMinor: "2" })).toBe(false);
  expect(sealed!.includes(payment.recipientReference)).toBe(false);
  expect(sealed!.includes(first!.key)).toBe(false);
  // Moving ciphertext to a different actor or attempt must fail authentication.
  await expect(readDraft("another-owner", id)).rejects.toThrow();
  await expect(readDraft("owner", randomUUID())).rejects.toThrow();
});

it("recovers a lost response using the original payload and key and stops after a conflict", async () => {
  const id = randomUUID();
  const payment: Payment = { sourceAccountId: randomUUID(), recipientReference: "rcp_test", amountMinor: "1", currency: "PHP" };
  let sealed: Buffer;
  let state = "review";
  query.mockImplementation(async (sql: string, params: unknown[]) => {
    if (sql.startsWith("INSERT")) {
      sealed = params[2] as Buffer;
      return { rowCount: 1 };
    }
    if (sql.includes("RETURNING sealed")) {
      if (params[0] !== "owner" || state !== params[3]) return { rows: [] };
      state = "uncertain";
      return { rows: [{ sealed }] };
    }
    if (sql.includes("decline_reason=$6")) state = String(params[3]);
    return {};
  });
  await saveDraft("owner", id, payment);
  const dispatch = vi.fn().mockResolvedValueOnce(failure("unknown-outcome")).mockResolvedValueOnce(failure("idempotency-conflict", 409));
  await submitDraft("owner", id, false, dispatch);
  await submitDraft("owner", id, false, dispatch);
  await submitDraft("other", id, true, dispatch);
  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(state).toBe("uncertain");
  await submitDraft("owner", id, true, dispatch);
  expect(dispatch.mock.calls[1]).toEqual(dispatch.mock.calls[0]);
  expect(dispatch.mock.calls[1][0]).toEqual(payment);
  expect(state).toBe("conflict");
  await submitDraft("owner", id, true, dispatch);
  expect(dispatch).toHaveBeenCalledTimes(2);
});
