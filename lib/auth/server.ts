import "server-only";
import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { Pool } from "pg";

export function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error("Missing server setting " + name);
  return value;
}

export function trustedUrl(name: string) {
  const url = new URL(required(name));
  const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash ||
      (url.protocol !== "https:" && !(local && url.protocol === "http:"))) throw new Error("Invalid " + name);
  return url;
}

function configure() {
  const origin = trustedUrl("APP_ORIGIN").origin;
  const issuer = trustedUrl("KEYCLOAK_ISSUER").href.replace(/\/$/, "");
  return betterAuth({
    baseURL: origin,
    secret: required("BETTER_AUTH_SECRET"),
    database: new Pool({ connectionString: required("WEB_DATABASE_URL"), options: "-c search_path=tiwalo_web", max: 5 }),
    trustedOrigins: [origin],
    logger: { disabled: true },
    account: { encryptOAuthTokens: true, storeAccountCookie: false, storeStateStrategy: "database", accountLinking: { enabled: false } },
    session: { expiresIn: 1800, disableSessionRefresh: true, cookieCache: { enabled: false } },
    advanced: { useSecureCookies: origin.startsWith("https:"), defaultCookieAttributes: { httpOnly: true, sameSite: "lax" } },
    onAPIError: { errorURL: origin + "/sign-in?error=1" },
    plugins: [genericOAuth({ config: [{
      providerId: "keycloak", clientId: required("KEYCLOAK_CLIENT_ID"), clientSecret: required("KEYCLOAK_CLIENT_SECRET"),
      discoveryUrl: issuer + "/.well-known/openid-configuration", requireIdTokenVerification: true,
      pkce: true, scopes: ["openid"], prompt: "login", disableProviderLogout: true,
      mapProfileToUser(profile) {
        if (typeof profile.sub !== "string" || !/^[a-f0-9-]{36}$/i.test(profile.sub)) throw new Error("Invalid identity");
        return { email: profile.sub + "@identity.invalid", name: "Tiwalo user", emailVerified: false };
      },
    }] })],
  });
}

let instance: ReturnType<typeof configure>;
export function auth() {
  return instance ??= configure();
}
