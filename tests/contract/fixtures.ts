import type { components, operations } from "../../lib/api/generated/banking";

export const account = {
  accountId: "00000000-0000-4000-8000-000000000001",
  recipientReference: "rcp_SYNTHETIC-source", status: "ACTIVE", currency: "PHP",
  availableBalanceMinor: "9007199254740993",
} satisfies components["schemas"]["Account"];

export const transfer = {
  sourceAccountId: account.accountId, recipientReference: "rcp_SYNTHETIC-Birch",
  currency: "PHP", amountMinor: "500000",
} satisfies components["schemas"]["TransferRequest"];

export const receipt = {
  ...transfer, transferId: "00000000-0000-4000-8000-000000000002",
  status: "POSTED", postedAt: "2026-11-18T02:30:00Z",
} satisfies components["schemas"]["TransferReceipt"];

export const page = {
  accounts: [account], nextCursor: "synthetic+/=",
} satisfies operations["listAccounts"]["responses"][200]["content"]["application/json"];

export const findings = {
  runId: "00000000-0000-4000-8000-000000000003",
  findings: [{ reference: "a".repeat(64), code: "BALANCE_MISMATCH", currency: "PHP",
    computedBalanceMinor: "-9223372036854775809", projectedBalanceMinor: "0" }],
  nextCursor: "a".repeat(64),
} satisfies operations["listReconciliationFindings"]["responses"][200]["content"]["application/json"];

export function problem(status: number, code: string): components["schemas"]["Problem"] {
  return { type: "urn:tiwalo:synthetic:problem", title: "Synthetic upstream title", status, code, detail: "Upstream diagnostic text" };
}
