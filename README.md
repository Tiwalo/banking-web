# Tiwalo banking web

Tiwalo is a simulated Philippine banking project using fictional balances and synthetic customers. Customers can view accounts, send internal transfers and retrieve receipts. Operators can inspect reconciliation findings for a known run. For local sign-in, follow the [W2 setup and verification instructions](docs/adr/0003-web-sessions.md).

## Run locally

Use Node 24.22.3 and its bundled npm 11.19.1. With a compatible Node version manager, select the version in `.nvmrc`. From the repository root run:

```sh
npm ci
npm run dev
```

Open [the local site](http://localhost:3000). The public page works without Keycloak, Spring, a database or an environment file. The illustration and Inter font are served locally. See [.env.example](.env.example) for optional development settings and planned server-only variables.

## Verify the foundation

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm exec -- playwright install --with-deps chromium
npm run test:e2e
```

On Windows or macOS, use `npm exec -- playwright install chromium` for browser installation. Playwright starts the production server on loopback port 3100 and shuts it down after the tests. Keep that port available. The suite checks keyboard navigation, narrow-screen reflow, accessible content, the 404 response and CSP enforcement. Vitest covers public components and the error retry action.

The [verification workflow](.github/workflows/verify.yml) runs these checks on Linux for pull requests and pushes to main. Production uses `npm run build` followed by `npm start` behind an HTTPS reverse proxy. See the [foundation decision](docs/adr/0001-web-foundation.md) for the rendering and deployment requirements.

## Design preview

Run `npm run preview:design` to open the local customer and operations previews. Run `npm run test:design` for the separate fixture-only browser suite and screenshot artifacts. [Preview guide](docs/design/W0-preview.md) · [Approved design](docs/design/TIWALO_MVP_DESIGN_SPEC.md).

## Backend dependency

### W4 internal transfers

Run `npm run auth:migrate` before starting the web app. Open an owned account as a customer with `accounts:read` and `transfers:create`, choose **Send money**, enter the exact recipient reference and PHP amount, and review before submitting. A verified Spring receipt confirms posting and the account balance is read again. Customers with `transfers:read` can retrieve an owned receipt by transfer ID.

The restricted web schema stores the exact request, key and any verified receipt in actor-bound AES-GCM ciphertext. Unsent drafts expire after 24 hours. Editing starts a new review. Submission saves the uncertain state before contacting Spring. The dashboard links unresolved payments after sign-in. An explicit retry reuses the original payload and key. If a process stops during submission, the retry becomes available after 30 seconds. A key conflict stops submission. Unresolved attempts have no automatic expiry. Terminal results expire after 24 hours. Preserve the encryption secret while recoverable attempts exist.

For the live two-tab check, set `W4_LIVE_CENT=1` for the test process before running `npm run test:identity`. It sends one fictional cent from the first synthetic seed account to the second and checks the receipt and refreshed source balance.

To check recovery after a lost Spring response, fund the first seed account with one fictional cent, set `W4_LIVE_RECOVERY=1` for the test process, and run `npm run test:recovery` with the local web app, Keycloak and Spring running. The test drops the real posting response at the server adapter, signs out, signs in with a fresh browser session, and explicitly retries the original payment. It verifies the original transfer ID, the receipt lookup, and exactly one cent debited.

W3 displays each owned account’s available balance from the B3 ledger-backed account API. Refresh on the dashboard or account detail makes a fresh authenticated read. Both views format decimal-string centavos directly. Run `npm run test:identity` with the local W2 setup. For an independent comparison, set `W3_CUSTOMER_1_MINOR` and `W3_CUSTOMER_2_MINOR` to the seeded accounts’ current ledger projections before running the suite.

W1 pins the B1 banking API at version 1.1.0, revision `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1`. Run `npm run contract:check` to verify the vendored spec and generated code, and `npm run test:contract` to exercise schema-validated fixtures and the server-only adapter. Use `npm run contract:generate` after deliberately updating the pin. [Contract and integration guide](docs/adr/0002-banking-api-contract.md)

### W5 read-only reconciliation

Sign in as a mapped operator with the `operations:investigate` client role. Open **Reconciliation**, enter a known run ID, and select **Look up findings**. Opening a run link prepares the form. Submitting it or selecting **Next findings** makes one audited Spring GET. References are masked and monetary evidence retains exact centavos. An empty result applies to that run alone. Run discovery and portfolio-wide metrics require additional contracts.

Set `W5_EMPTY_RUN_ID` and `W5_MULTI_RUN_ID` (a local report with more than 20 findings) before running `npm run test:identity` to exercise live paging. W5 uses the existing B5 API contract and needs no web database migration.
