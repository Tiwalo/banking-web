import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = randomBytes(16).toString("base64");
  const development = process.env.NODE_ENV === "development";
  const signInForm = ["/sign-in", "/dashboard", "/access-denied"].includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/accounts/");
  const issuer = process.env.KEYCLOAK_ISSUER;
  const formTarget = signInForm && issuer ? " " + new URL(issuer).origin : "";
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}`,
    development ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`,
    development ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'" + formTarget,
  ].join("; ");

  // Next reads the request policy to nonce its own scripts during rendering.
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  // Native same-origin form POSTs need an Origin for CSRF verification.
  if (signInForm || request.nextUrl.pathname.startsWith("/transfers/")) response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static/|_next/image(?:/|$)|images/terraces-(?:720|1440)\\.webp$).*)"],
};
