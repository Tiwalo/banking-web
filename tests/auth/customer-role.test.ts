import { describe, expect, it } from "vitest";
import { canInvestigate, canReadCustomerAccounts } from "../../lib/auth/customer-role";

describe("customer account access", () => {
  it("requires a dedicated banking operator role for findings", () => {
    expect(canInvestigate({ resource_access: { "banking-core-api": { roles: ["operations:investigate"] } } })).toBe(true);
    expect(canInvestigate({ resource_access: { "tiwalo-web": { roles: ["operations:investigate"] } } })).toBe(false);
    for (const roles of [["accounts:read"], ["accounts:read", "operations:investigate"], "operations:investigate"]) {
      expect(canInvestigate({ resource_access: { "banking-core-api": { roles } } })).toBe(false);
    }
  });
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
