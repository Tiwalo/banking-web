# MVP release verification

Record the candidate commit, banking API revision, test results and previous deployable web revision for each release. The current contract is banking API 1.1.0 at `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1`.

## Candidate checks

1. With the pinned Node and npm versions, run `npm ci`, `npm run contract:check`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Run `npm run test:e2e` against the production build. Run `npm run test:design` separately for the synthetic previews.
2. With local Spring, Keycloak and the development web server running, set both W5 report IDs and run `npm run test:identity`. Check customer and operator sign-in, denied cross-role and cross-owner reads, logout, expiry, and explicit findings pagination.
3. For financial acceptance, use the W4 opt-in checks documented in the README. Each needs one fictional cent in the funded synthetic source account. Record the receipt and balance assertions for both two-tab submission and response-loss recovery. A skipped check is still pending for that candidate.

## Deployment and rollback rehearsal

Deploy the same production build behind the target HTTPS reverse proxy. Set the trusted app origin, Keycloak issuer, confidential client settings, banking API base URL and restricted web database connection in the deployment environment. Register the target callback and signed-out URLs in Keycloak. Preserve the existing encryption secret and apply `npm run auth:migrate` before starting the candidate with `npm start`.

From a fresh browser session on the target origin, verify the simulated-funds disclosure, Keycloak login and logout, Secure/HttpOnly session cookie, enforced CSP and private/no-store responses. Check keyboard access and visible focus through account review and operator paging. Use synthetic identities for role checks. Record the outcome on the target separately from local browser results.

For a rollback rehearsal, route traffic back to the previous compatible web build. Preserve the web schema, pending attempts, encryption secret and Spring ledger. Check sign-in and owner-scoped account reads again. If a payment outcome is uncertain, recover the original attempt with its saved key on a compatible build. Record the deployed revision and recovery outcome before closing the release.

## Local rehearsal · 23 November 2026

The candidate was the W6 working tree based on `279e885`, with production build ID `Eal2OTIoeAemKTxtBF8va`. The rollback target was a separately built, unmodified W5 checkout of `279e885`, build ID `4RbcbBSi7YHHM0JywB5HM`. W6 changed verification and documentation. The two builds contained the same application source.

- **Financial checks.** Against local development services, the live two-tab test and live response-loss recovery test each passed. Two fictional centavos funded the checks. The assertions verified the original receipt and a single-cent debit per logical transfer, including replay after a new sign-in.
- **HTTPS candidate.** A loopback TLS proxy served the production build, an isolated Keycloak realm and a Spring instance using a disposable copy of the synthetic banking database. A fresh customer login produced a Secure, HttpOnly, SameSite=Lax session cookie. The dashboard sent an enforced nonce CSP and private/no-store headers. Keyboard navigation reached transfer review and its submit control. Operator pagination returned 20 findings, then one. Cross-owner and cross-role reads were denied.
- **Cutover.** Switching the web upstream to W5 preserved the signed-in session, displayed balance and saved review. Logout, fresh Keycloak login, owned account detail and cross-owner denial passed on W5.
- **Cleanup.** The temporary proxy raised a shutdown error after the last assertion. The remaining rehearsal container, database and temporary build/TLS directory were removed and their absence verified. The deployment evidence applies to loopback HTTPS with a rehearsal certificate.
