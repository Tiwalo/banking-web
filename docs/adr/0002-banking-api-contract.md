# ADR 0002 — Pin the banking API at the web boundary

W1 consumes the B1 contract published by banking-core-api. The release is API 1.1.0 in OpenAPI 3.1.1 format, at commit `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1`. The source path and SHA-256 of its original Git blob are recorded in [the pin](../../api/openapi/pin.json). Preserve the YAML bytes, including line endings. [Upstream source](https://github.com/Tiwalo/banking-core-api/blob/fc06aebdc53ae2e4a28e54aaeb875294e317e8c1/api/openapi/banking-v1.yaml)

## Reproduce and verify

With the repository's pinned Node and npm, run `npm ci`, then `npm run contract:check` and `npm run test:contract`. Generation and drift checks use the vendored artifact offline. To adopt a reviewed backend release, obtain the original Git blob from its immutable revision, verify its digest, update the YAML and pin together, then run `npm run contract:generate`. Review the generated declarations, runtime validators, operation wrappers and fixtures in the same change. CI regenerates in memory and fails on changed bytes, metadata or generated output.

## Server-only consumption

A verified server session will supply an access token per request in W2. The caller must first verify the actor and authorize the requested operation. Use `createCustomerApi` for owner-scoped account list/detail, explicit transfer creation and receipt reads. Use `createOperatorApi` for an explicit findings lookup by known run ID and cursor. The backend also contracts a reconciliation-creation POST. The read-only operator adapter exposes only the findings GET. Spring remains the authority for ownership and role permissions.

Configure `BANKING_API_BASE_URL` on the server with the full trusted HTTPS service URL ending in `/api/v1`. Local development permits HTTP on loopback. No credentials or services are needed to build the public app or run fixture tests. Each call uses bearer authentication, disables caching and redirects, and validates successful JSON before returning typed data. RFC 9457 problems yield controlled messages. Backend titles, details and tokens stay out of results and logs.

Transfer submission requires an explicit original key and a schema-valid draft. The adapter performs a single request per call. Check the verified receipt, Location and echoed draft before accepting success. A transport interruption, unexpected response, or 503 leaves the outcome unknown. Only the specified 422 codes establish a definite decline. Durable original-attempt storage, explicit same-key recovery and the authenticated UI are W4 dependencies.

## Integration evidence and gaps

Contract tests inject a synthetic Fetch transport and validate fixtures against the pinned operation schemas. W1 introduces no application routes, public mock endpoints, session, live integration or database migration. W2 requires real Keycloak and authorized account verification. Dashboard totals, transaction feeds, recipient name resolution, receipt enumeration, report discovery, journal details and audit listings remain contract dependencies. Rollback restores the prior client, pin and generated artifacts together.
