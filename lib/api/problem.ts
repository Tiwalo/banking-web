import type { components } from "./generated/banking";
import { isProblem } from "./generated/validate.cjs";

type Problem = components["schemas"]["Problem"];
const messages = {
  "invalid-request": "Check the request details.",
  unauthenticated: "Sign in again to continue.",
  forbidden: "You do not have permission to access this resource.",
  "not-found": "The requested resource is unavailable.",
  "idempotency-conflict": "This payment key was used with different details. Resolve the original transfer.",
  "insufficient-funds": "The transfer was declined because the source account has insufficient funds.",
  "transfer-limit": "The transfer was declined because the amount exceeds the transfer limit.",
  "same-account": "The transfer was declined because the source and destination are the same account.",
  "account-unavailable": "The transfer was declined because an account is unavailable.",
  "unknown-outcome": "The transfer outcome is unknown. Resolve the original attempt before starting another.",
  unavailable: "The banking service is temporarily unavailable.",
  "invalid-response": "The banking service returned an unexpected response.",
} as const;
type FailureKind = keyof typeof messages;
export type ApiFailure = { ok: false; kind: FailureKind; message: string; status?: number };
export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

export function failure(kind: FailureKind, status?: number): ApiFailure {
  return { ok: false, kind, message: messages[kind], ...(status === undefined ? {} : { status }) };
}

function validProblem(value: unknown): value is Problem {
  return isProblem(value);
}

const problems: Readonly<Record<string, { status: number; kind: FailureKind; transferOnly?: true } | undefined>> = {
  INVALID_REQUEST: { status: 400, kind: "invalid-request" },
  UNAUTHORIZED: { status: 401, kind: "unauthenticated" },
  FORBIDDEN: { status: 403, kind: "forbidden" },
  NOT_FOUND: { status: 404, kind: "not-found" },
  IDEMPOTENCY_CONFLICT: { status: 409, kind: "idempotency-conflict", transferOnly: true },
  INSUFFICIENT_FUNDS: { status: 422, kind: "insufficient-funds", transferOnly: true },
  TRANSFER_LIMIT_EXCEEDED: { status: 422, kind: "transfer-limit", transferOnly: true },
  SAME_ACCOUNT: { status: 422, kind: "same-account", transferOnly: true },
  ACCOUNT_UNAVAILABLE: { status: 422, kind: "account-unavailable", transferOnly: true },
};

export function fromProblem(status: number, value: unknown, submitting: boolean): ApiFailure {
  if (validProblem(value) && value.status === status) {
    const match = problems[value.code];
    if (match?.status === status && (!match.transferOnly || submitting)) return failure(match.kind, status);
  }
  if (submitting) return failure("unknown-outcome", status);
  return failure(status >= 500 ? "unavailable" : "invalid-response", status);
}
