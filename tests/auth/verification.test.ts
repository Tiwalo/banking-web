// @vitest-environment node
import { errors, jwtVerify } from "jose";
import { APIError } from "better-auth/api";
import { expect, it, vi } from "vitest";
import { customerAccounts } from "../../lib/auth/accounts";
import { createCustomerApi } from "../../lib/api/client";

const getAccessToken = vi.hoisted(() => vi.fn(async () => ({ accessToken: "fixture" })));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: () => new Headers({ cookie: "better-auth.session_token=fixture" }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(path); } }));
vi.mock("../../lib/api/client", () => ({ createCustomerApi: vi.fn() }));
vi.mock("../../lib/auth/server", () => ({
  trustedUrl: () => new URL("https://identity.example/"),
  auth: () => ({ api: {
    getSession: () => ({}),
    listUserAccounts: () => [{ providerId: "keycloak", id: "fixture" }],
    getAccessToken,
  } }),
}));
vi.mock("jose", async importOriginal => ({ ...await importOriginal<typeof import("jose")>(), jwtVerify: vi.fn() }));

it("returns the recovery state without reading accounts when refreshing the token fails", async () => {
  getAccessToken.mockRejectedValueOnce(new APIError("BAD_REQUEST", { code: "FAILED_TO_GET_ACCESS_TOKEN" }));
  await expect(customerAccounts()).resolves.toBeNull();
  expect(createCustomerApi).not.toHaveBeenCalled();
});

it("offers retry for a signing-key outage and requires sign-in for an invalid token", async () => {
  vi.mocked(jwtVerify).mockRejectedValueOnce(new errors.JWKSTimeout());
  await expect(customerAccounts()).rejects.toThrow("Identity verification is temporarily unavailable");
  vi.mocked(jwtVerify).mockRejectedValueOnce(new errors.JWSSignatureVerificationFailed());
  await expect(customerAccounts()).rejects.toThrow("/sign-in?expired=1");
  expect(createCustomerApi).not.toHaveBeenCalled();
});
