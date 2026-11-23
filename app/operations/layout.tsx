import Link from "next/link";
import { verifiedOperator } from "@/lib/auth/accounts";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";

export default async function OperationsLayout({ children }: { children: React.ReactNode }) {
  if (!await verifiedOperator()) return <AccountAccessRecovery retryHref="/operations" />;
  return <div className="ops-layout"><aside><nav aria-label="Operations navigation">
    <Link href="/operations">Operations dashboard</Link>
    <Link href="/operations/reconciliations">Reconciliation</Link>
  </nav><form method="post" action="/logout"><button className="action secondary">Log out</button></form></aside>
    <section className="account-view">{children}</section></div>;
}
