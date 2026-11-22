# W2 customer sessions

Better Auth exchanges the Keycloak authorization code using PKCE, verifies the provider identity and stores encrypted OAuth tokens in PostgreSQL. A signed opaque HttpOnly cookie identifies a database session with a fixed 30-minute lifetime. HTTPS origins use Secure cookies. Customer reads verify the access token signature, issuer, expiry, banking audience, authorized party and provider account subject. Spring enforces ownership for both list and detail. Operator identities take the access-denied path. W2 has no financial mutation handler.

## Local setup

1. Use the existing PostgreSQL instance, Keycloak realm and running banking API. Register the exact valid redirect URI `http://localhost:3000/api/auth/callback/keycloak` and valid post-logout redirect URI `http://localhost:3000/signed-out` on the confidential `tiwalo-web` client. Require S256 PKCE. Include the banking audience and client role mappers.
2. Provision a dedicated web login with privileges limited to its own schema. For a fresh local setup, connect to `banking_core` as a database administrator in interactive psql and run the following. The password prompt keeps the password out of command history.

   ```sql
   CREATE ROLE tiwalo_web LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
   \password tiwalo_web
   CREATE SCHEMA tiwalo_web AUTHORIZATION tiwalo_web;
   REVOKE ALL ON SCHEMA tiwalo_web FROM PUBLIC;
   ```

3. Keep your existing Keycloak settings in the web checkout’s ignored `.env.local`. Add `APP_ORIGIN=http://localhost:3000`, `BANKING_API_BASE_URL=http://localhost:8081/api/v1`, and `WEB_DATABASE_URL=postgresql://tiwalo_web:<encoded-password>@localhost:<published-postgres-port>/banking_core`. URL-encode special characters in the password. Use `docker compose port postgres 5432` in the backend checkout to find the host port. Set `BETTER_AUTH_SECRET` to a fresh random secret of at least 32 bytes. Keep it stable across restarts.
4. From the web checkout run `npm ci`, `npm run auth:migrate`, then `npm run dev`. Open [customer sign-in](http://localhost:3000/sign-in). Use localhost consistently. The production profile requires HTTPS for the app, identity provider and banking API.

## Live acceptance

When Better Auth reports `FAILED_TO_GET_ACCESS_TOKEN`, the dashboard and account detail stop before calling Spring. Both pages offer a retry of the same read and a fresh Keycloak sign-in. The provider error can describe either a temporary outage or a credential that requires another login.

With the local development server running, set `W2_CUSTOMER_1_PASSWORD`, `W2_CUSTOMER_2_PASSWORD`, and `W2_OPERATOR_PASSWORD` for the seeded synthetic logins in the ignored `.env.local`. Run `npm run test:identity`. This separate Playwright suite signs in against the local realm and expires only its own test session. It expects the two standard seeded account IDs.

In separate browser profiles, sign in as each synthetic customer. Compare the masked reference on the dashboard with that customer’s API result. Open account details, then visit the other customer’s detail URL and confirm the account data stays hidden. Sign in as the operator and confirm the dashboard shows access denied. Log out, complete Keycloak’s confirmation, and revisit a detail URL. Repeat after session expiry. The browser should return to sign-in. Check for private/no-store responses and a session cookie with HttpOnly and SameSite=Lax. The callback and redirect never need client-side access to a bearer token.

The migration is explicit. Deploy with a dedicated web schema and a runtime role restricted to the session tables. Roll back the application and invalidate web sessions if withdrawing W2. Keep the session tables until rollback and retention requirements are satisfied.
