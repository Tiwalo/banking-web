import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { getSessionCookie } from "better-auth/cookies";
import { createCustomerApi } from "../api/client";
import { canReadCustomerAccounts } from "./customer-role";
import { auth, required, trustedUrl } from "./server";

let keys: ReturnType<typeof createRemoteJWKSet>;
export async function customerAccounts() {
  const requestHeaders = await headers();
  if (!getSessionCookie(requestHeaders)) redirect("/sign-in");
  const session = await auth().api.getSession({ headers: requestHeaders });
  if (!session) redirect("/sign-in?expired=1");
  const issuer = trustedUrl("KEYCLOAK_ISSUER").href.replace(/\/$/, "");
  let token: string;
  let allowed: boolean;
  try {
    const accounts = await auth().api.listUserAccounts({ headers: requestHeaders });
    const account = accounts.find(item => item.providerId === "keycloak");
    if (!account) throw new Error("Missing provider account");
    const result = await auth().api.getAccessToken({ headers: requestHeaders, body: { accountId: account.id } });
    token = result.accessToken;
    keys ??= createRemoteJWKSet(new URL(issuer + "/protocol/openid-connect/certs"));
    const { payload } = await jwtVerify(token, keys, {
      issuer, audience: "banking-core-api", algorithms: ["RS256"], requiredClaims: ["exp", "sub", "azp"],
    });
    allowed = payload.azp === required("KEYCLOAK_CLIENT_ID") &&
      account.accountId === payload.sub &&
      canReadCustomerAccounts({ resource_access: payload.resource_access });
  } catch {
    redirect("/sign-in?expired=1");
  }
  if (!allowed) redirect("/access-denied");
  return createCustomerApi({ accessToken: token });
}
