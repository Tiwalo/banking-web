import type { AccountDisplay } from "../components/BankingPanels";

// Every value in this module is synthetic. Keep it outside the production import graph.
export const accounts: (AccountDisplay & { id: string })[] = [
  { id: "10000000-0000-4000-8000-000000000001", reference: "W0-FIXTURE-1842", minor: "1743250", status: "Active" },
  { id: "10000000-0000-4000-8000-000000000002", reference: "W0-FIXTURE-6091", minor: "320075", status: "Frozen" },
];
export const receipt = {
  id: "20000000-0000-4000-8000-000000000001", source: accounts[0].reference,
  recipient: "W0-FIXTURE-7X9A", minor: "125050", postedAt: "2026-11-12T04:30:00Z",
};
export const runId = "30000000-0000-4000-8000-000000000001";
export const findingPages = [
  [{ reference: "1".repeat(60) + "d8a1", code: "Balance mismatch", evidence: [["Computed balance", "1500"], ["Projected balance", "1200"]] }],
  [{ reference: "2".repeat(60) + "b392", code: "Missing posting audit", evidence: [] }],
];
export const initialDraft = { source: receipt.source, recipient: receipt.recipient, pesos: "1250.50" };
export type Draft = typeof initialDraft;
