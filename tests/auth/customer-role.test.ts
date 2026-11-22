import { describe, expect, it } from "vitest";
import { canReadCustomerAccounts } from "../../lib/auth/customer-role";

describe("customer account access", () => {
  it("requires the account reader role on the banking API client", () => {
    expect(canReadCustomerAccounts({ resource_access: { "banking-core-api": { roles: ["accounts:read"] } } })).toBe(true);
    expect(canReadCustomerAccounts({ resource_access: { "tiwalo-web": { roles: ["accounts:read"] } } })).toBe(false);
  });

  it("denies operator, ambiguous, and malformed role assignments", () => {
    for (const roles of [[], ["operations:investigate"], ["operations:investigate", "accounts:read"], "accounts:read", null]) {
      expect(canReadCustomerAccounts({ resource_access: { "banking-core-api": { roles } } })).toBe(false);
    }
  });
});
