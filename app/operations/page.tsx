import Link from "next/link";

export default function Operations() {
  return <><h1>Operations dashboard</h1><p>Simulated banking · Read-only access</p>
    <h2>Reconciliation findings</h2><p>Use a known run ID to inspect the evidence recorded for that run.</p>
    <Link className="action" href="/operations/reconciliations">Open reconciliation</Link></>;
}
