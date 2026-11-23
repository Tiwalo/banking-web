import type { components } from "../api/generated/banking";
import { formatPhp } from "../money";

const evidenceFields = [
  ["computedBalanceMinor", "Computed balance"], ["projectedBalanceMinor", "Projected balance"],
  ["debitTotalMinor", "Debit total"], ["creditTotalMinor", "Credit total"],
] as const;

export function displayFinding(finding: components["schemas"]["ReconciliationFinding"]) {
  return {
    reference: "…" + finding.reference.slice(-8),
    check: finding.code.toLowerCase().replaceAll("_", " "),
    evidence: evidenceFields.flatMap(([field, label]) => {
      const value = finding[field];
      return value === undefined ? [] : [label + " " + formatPhp(value)];
    }),
  };
}

export type LookupState = { error: string } | {
  run: string; findings: ReturnType<typeof displayFinding>[]; next?: string;
} | null;
