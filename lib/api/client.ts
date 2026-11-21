import "server-only";
import createClient from "openapi-fetch";
import type { components, operations, paths } from "./generated/banking";
import {
  isAccount, isAccountPage, isFindingsPage, isId, isIdempotencyKey, isTransferReceipt, isTransferRequest,
} from "./generated/validate.cjs";
import { failure, fromProblem, type ApiResult } from "./problem";

type Transfer = components["schemas"]["TransferRequest"];
type Receipt = components["schemas"]["TransferReceipt"];
type Options = { accessToken: string; baseUrl?: string; fetch?: (request: Request) => Promise<Response> };

function transport({ accessToken, baseUrl = process.env.BANKING_API_BASE_URL, fetch }: Options) {
  if (!baseUrl) throw new Error("Set BANKING_API_BASE_URL on the server.");
  const url = new URL(baseUrl);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const localHttp = process.env.NODE_ENV !== "production" && local && url.protocol === "http:";
  if ((url.protocol !== "https:" && !localHttp) || url.username || url.password || url.search || url.hash ||
      url.pathname.replace(/\/$/, "") !== "/api/v1") {
    throw new Error("Configure a trusted banking HTTPS base URL ending in /api/v1.");
  }
  if (!accessToken || /\s/.test(accessToken)) throw new Error("A server-held access token is required.");
  const client = createClient<paths>({
    baseUrl: url.href.replace(/\/$/, ""), fetch, cache: "no-store", redirect: "error", credentials: "omit",
    headers: { Authorization: "Bearer " + accessToken, Accept: "application/json, application/problem+json" },
  });
  return { client, baseUrl: url };
}

type Reply<T> = { response: Response; data?: T; error?: unknown };
async function receive<T>(
  send: () => Promise<Reply<T>>,
  expectedStatus: 200 | 201,
  validate: (data: T, response: Response) => boolean,
): Promise<ApiResult<T>> {
  const submitting = expectedStatus === 201;
  try {
    const { response, data, error } = await send();
    const mediaType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (!response.ok) {
      return fromProblem(response.status, mediaType === "application/problem+json" ? error : undefined, submitting);
    }
    if (response.status !== expectedStatus || mediaType !== "application/json" || data === undefined || !validate(data, response)) {
      return failure(submitting ? "unknown-outcome" : "invalid-response", response.status);
    }
    return { ok: true, data };
  } catch {
    // A lost response or unreadable success cannot establish whether a payment posted.
    return failure(submitting ? "unknown-outcome" : "unavailable");
  }
}

function sameId(left: string, right: string) {
  return left.toLowerCase() === right.toLowerCase();
}

function matchesReceiptLocation(value: string | null, base: URL, transferId: string) {
  if (!value) return false;
  const expected = new URL("/api/v1/transfers/" + transferId, base);
  const actual = new URL(value, new URL("/api/v1/transfers", base));
  return actual.href === expected.href;
}

export function createCustomerApi(options: Options) {
  const { client, baseUrl } = transport(options);
  return {
    listAccounts(query: operations["listAccounts"]["parameters"]["query"] = {}) {
      return receive(() => client.GET("/accounts", { params: { query } }), 200, data => isAccountPage(data));
    },
    async getAccount(accountId: string) {
      if (!isId(accountId)) return failure("invalid-request");
      return receive(() => client.GET("/accounts/{accountId}", { params: { path: { accountId } } }), 200,
        data => isAccount(data) && sameId(data.accountId, accountId));
    },
    async getReceipt(transferId: string) {
      if (!isId(transferId)) return failure("invalid-request");
      return receive(() => client.GET("/transfers/{transferId}", { params: { path: { transferId } } }), 200,
        data => isTransferReceipt(data) && sameId(data.transferId, transferId));
    },
    async createTransfer(body: Transfer, idempotencyKey: string): Promise<ApiResult<Receipt>> {
      if (!isTransferRequest(body) || !isIdempotencyKey(idempotencyKey)) return failure("invalid-request");
      // Capture the exact logical draft before dispatch, including the case-sensitive recipient reference.
      const draft = { ...body };
      return receive(() => client.POST("/transfers", {
        body: draft, params: { header: { "Idempotency-Key": idempotencyKey } },
      }), 201, (receipt, response) => {
        if (!isTransferReceipt(receipt) || !sameId(receipt.sourceAccountId, draft.sourceAccountId) ||
            receipt.recipientReference !== draft.recipientReference || receipt.currency !== draft.currency ||
            receipt.amountMinor !== draft.amountMinor) return false;
        return matchesReceiptLocation(response.headers.get("location"), baseUrl, receipt.transferId);
      });
    },
  };
}

export function createOperatorApi(options: Options) {
  const { client } = transport(options);
  return {
    async listFindings(runId: string, query: operations["listReconciliationFindings"]["parameters"]["query"] = {}) {
      if (!isId(runId)) return failure("invalid-request");
      return receive(() => client.GET("/operations/reconciliations/{runId}/findings", {
        params: { path: { runId }, query },
      }), 200, data => isFindingsPage(data) && sameId(data.runId, runId));
    },
  };
}
