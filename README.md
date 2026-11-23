# Tiwalo banking web

Tiwalo is a simulated Philippine banking project using fictional balances and synthetic customers. The web app provides a public introduction and a private, read-only customer account dashboard. For local sign-in, follow the [W2 setup and verification instructions](docs/adr/0003-web-sessions.md).

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

W3 displays each owned account’s available balance from the B3 ledger-backed account API. Refresh on the dashboard or account detail makes a fresh authenticated read. Both views format decimal-string centavos directly. Run `npm run test:identity` with the local W2 setup. For an independent comparison, set `W3_CUSTOMER_1_MINOR` and `W3_CUSTOMER_2_MINOR` to the seeded accounts’ current ledger projections before running the suite.

W1 pins the B1 banking API at version 1.1.0, revision `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1`. Run `npm run contract:check` to verify the vendored spec and generated code, and `npm run test:contract` to exercise schema-validated fixtures and the server-only adapter. Use `npm run contract:generate` after deliberately updating the pin. [Contract and integration guide](docs/adr/0002-banking-api-contract.md)
