# ADR 0001 — Web foundation

Accepted for W0.

## Runtime and assets

Keep the root Next.js App Router, React, strict TypeScript and Tailwind/Turbopack scaffold. Pin Node 24.22.3 LTS, npm 11.19.1 and the matching Next.js ESLint preset. Install with the committed npm lockfile. Use the self-hosted Inter 4.1 variable font (with a system fallback) and two locally optimized WebP sizes of an original AI-generated Cordillera landscape illustration. These assets require no external requests during a build or page visit.

## Rendering and browser policy

Serve documents from a Node process. The request proxy creates a fresh script nonce and supplies the same CSP to Next.js and the browser. The root layout waits for the request before rendering so framework scripts receive its nonce. This trades static HTML caching for a per-response script policy. Cache Components and partial prefetching are disabled. Documents use private, no-store caching. Static assets can be cached independently. The proxy provides headers and has no authorization responsibilities.

The production policy restricts connections and forms to the web origin, prohibits embedding and sets a no-referrer policy. Development permits the scripts, styles and sockets needed by the local dev server. Add Keycloak-specific integration behavior and tests in W2.

## Release and rollback

Build and start the same revision with the pinned Node runtime. Terminate TLS at the reverse proxy, enable HSTS there and preserve application response headers. Verify the public page and missing-page response through the proxy before promotion. A rollback redeploys the previous build. W0 introduces no database migrations or financial state. Public CI artifacts must exclude secrets and personal data.
