# Tiwalo banking web

Tiwalo is a simulated Philippine banking project using fictional balances and synthetic customers. W0 delivers a public introduction, an accessible site shell and production browser verification. Sign-in, account access and transfers are planned integrations.

## Run locally

Use Node 24.22.3 and its bundled npm 11.19.1. With a compatible Node version manager, select the version in `.nvmrc`. From the repository root run:

```sh
npm ci
npm run dev
```

Open [the local site](http://localhost:3000). The public page works without Keycloak, Spring, a database or an environment file. The illustration and fonts are served locally or supplied by the operating system. See [.env.example](.env.example) for optional development settings and planned server-only variables.

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

## Backend dependency

W0 aligns with backend foundation milestone B0. It sends no banking requests and holds no credentials. W1 will pin the published [banking API contract](https://github.com/Tiwalo/banking-core-api/blob/fc06aebdc53ae2e4a28e54aaeb875294e317e8c1/api/openapi/banking-v1.yaml) at commit `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1` and generate the server-side adapter types. The backend owns account authorization, posting, receipts and reconciliation.
