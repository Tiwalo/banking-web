/** Call only with the claims of a verified banking API access token. */
export function canReadCustomerAccounts(claims: {
  resource_access?: unknown;
}): boolean {
  const resources = claims.resource_access;
  if (!resources || typeof resources !== "object" || !("banking-core-api" in resources)) return false;
  const client = resources["banking-core-api"];
  if (!client || typeof client !== "object" || !("roles" in client)) return false;
  const roles = client.roles;
  return Array.isArray(roles) && roles.includes("accounts:read") && !roles.includes("operations:investigate");
}
