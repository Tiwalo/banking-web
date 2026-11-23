import { expect, it } from "vitest";
import { displayFinding } from "../../lib/operations/findings";
import { findings } from "./fixtures";

it("masks the opaque reference and displays only allowlisted evidence without rounding", () => {
  const row = { ...findings.findings[0], rawJournal: "private journal" };
  expect(displayFinding(row)).toEqual({ reference: "…aaaaaaaa", check: "balance mismatch",
    evidence: ["Computed balance −₱92,233,720,368,547,758.09", "Projected balance ₱0.00"] });
});

it("displays link-only findings without adding monetary evidence", () => {
  expect(displayFinding({ reference: "0".repeat(64), code: "MISSING_POSTING_AUDIT" }).evidence).toEqual([]);
});
