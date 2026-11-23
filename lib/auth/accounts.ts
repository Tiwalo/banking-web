import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createRemoteJWKSet, errors, jwtVerify } from "jose";
import { APIError } from "better-auth/api";
import { getSessionCookie } from "better-auth/cookies";
import { createCustomerApi, createOperatorApi } from "../api/client";
import { canInvestigate, canReadCustomerAccounts } from "./customer-role";
import { auth, required, trustedUrl } from "./server";

let keys: ReturnType<typeof createRemoteJWKSet>;
async function verifiedIdentity() {
  const requestHeaders = await headers();
  if (!getSessionCookie(requestHeaders)) redirect("/sign-in");
  const session = await auth().api.getSession({ headers: requestHeaders });
  if (!session) redirect("/sign-in?expired=1");
  const issuer = trustedUrl("KEYCLOAK_ISSUER").href.replace(/\/$/, "");
  let token: string;
  let claims;
  try {
    const accounts = await auth().api.listUserAccounts({ headers: requestHeaders });
    const account = accounts.find(item => item.providerId === "keycloak");
    if (!account) throw new errors.JWTInvalid("Missing provider account");
    const result = await auth().api.getAccessToken({ headers: requestHeaders, body: { accountId: account.id } });
    token = result.accessToken;
    keys ??= createRemoteJWKSet(new URL(issuer + "/protocol/openid-connect/certs"));
    const { payload } = await jwtVerify(token, keys, {
      issuer, audience: "banking-core-api", algorithms: ["RS256"], requiredClaims: ["exp", "sub", "azp"],
    });
    if (payload.azp !== required("KEYCLOAK_CLIENT_ID") || payload.sub !== account.accountId)
      throw new errors.JWTInvalid("Unexpected token identity");
    claims = { resource_access: payload.resource_access };
  } catch (error) {
    // Better Auth uses this code for both refresh outages and revoked credentials.
    if (error instanceof APIError && error.statusCode === 400 &&
        error.body?.code === "FAILED_TO_GET_ACCESS_TOKEN") return null;
    if (error instanceof errors.JWTExpired || error instanceof errors.JWTInvalid ||
        error instanceof errors.JWTClaimValidationFailed || error instanceof errors.JWSInvalid ||
        error instanceof errors.JWSSignatureVerificationFailed || error instanceof errors.JOSEAlgNotAllowed ||
        (error instanceof APIError && error.statusCode === 401)) redirect("/sign-in?expired=1");
    // The page error boundary offers a retry while preserving the session.
    throw new Error("Identity verification is temporarily unavailable.");
  }
  return { actor: session.user.id, claims, accessToken: token };
}

export async function verifiedCustomer(permission: "accounts:read" | "transfers:create" | "transfers:read" = "accounts:read", dashboard = false) {
  const identity = await verifiedIdentity();
  if (!identity) return null;
  if (dashboard && canInvestigate(identity.claims)) redirect("/operations");
  if (!canReadCustomerAccounts(identity.claims, permission)) redirect("/access-denied");
  return { actor: identity.actor, canPreparePayment: canReadCustomerAccounts(identity.claims, "transfers:create"),
    canReadReceipts: canReadCustomerAccounts(identity.claims, "transfers:read"), api: createCustomerApi({ accessToken: identity.accessToken }) };
}

export async function verifiedOperator() {
  const identity = await verifiedIdentity();
  if (!identity) return null;
  if (!canInvestigate(identity.claims)) redirect("/access-denied?area=operations");
  return { actor: identity.actor, api: createOperatorApi({ accessToken: identity.accessToken }) };
}

export async function customerAccounts() {
  return (await verifiedCustomer())?.api ?? null;
}
