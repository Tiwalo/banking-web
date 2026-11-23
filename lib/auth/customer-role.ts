type Claims = { resource_access?: unknown };
function bankingRoles(claims: Claims): unknown[] {
  const resources = claims.resource_access;
  if (!resources || typeof resources !== "object" || !("banking-core-api" in resources)) return [];
  const client = resources["banking-core-api"];
  if (!client || typeof client !== "object" || !("roles" in client)) return [];
  return Array.isArray(client.roles) ? client.roles : [];
}
export function canInvestigate(claims: Claims) {
  const roles = bankingRoles(claims);
  return roles.includes("operations:investigate") && !roles.some(role =>
    role === "accounts:read" || role === "transfers:create" || role === "transfers:read");
}
export function canReadCustomerAccounts(claims: Claims, permission: "accounts:read" | "transfers:create" | "transfers:read" = "accounts:read"): boolean {
  const roles = bankingRoles(claims);
  return roles.includes("accounts:read") && roles.includes(permission) && !roles.includes("operations:investigate");
}
