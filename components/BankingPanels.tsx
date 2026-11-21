import { AlertTriangle, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock3, CreditCard, Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { formatPhp } from "../lib/money";

export type Tone = "positive" | "pending" | "attention" | "negative" | "neutral";
const toneIcon: Record<Tone, LucideIcon> = {
  positive: CheckCircle2, pending: Clock3, attention: AlertTriangle, negative: AlertTriangle, neutral: Info,
};

export function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const Icon = toneIcon[tone];
  return <span className={"badge " + tone}><Icon size={15} aria-hidden="true" />{children}</span>;
}

export function maskedReference(reference: string) {
  return "•••• " + reference.slice(-4);
}

function Terraces() {
  // Original contour lines. No currency artwork or external assets.
  return <svg className="contours" viewBox="0 0 500 160" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    {Array.from({ length: 19 }, (_, row) => {
      const y = row * 3;
      return <path key={row} d={`M-20 ${156+y} Q44 ${131+y} 76 ${134+y} T152 ${113+y} Q187 ${84+y} 224 ${104+y} Q251 ${117+y} 294 ${79+y} L353 ${29+y} Q368 ${12+y} 377 ${18+y} Q410 ${59+y} 445 ${68+y} T525 ${90+y}`} />;
    })}
  </svg>;
}

export function BalanceCard({ reference, minor }: { reference: string; minor: string }) {
  return <section className="balance-card" aria-label="Available balance">
    <Terraces /><div><span>Available balance</span><strong className="money">{formatPhp(minor)}</strong>
    <small>PHP account · {maskedReference(reference)}</small></div>
  </section>;
}

export interface AccountDisplay { reference: string; minor: string; status: "Active" | "Frozen" | "Closed" }
export function AccountRow({ account, href }: { account: AccountDisplay; href: string }) {
  return <a className="entry-row" href={href}>
    <span className="icon-tile"><CreditCard size={21} aria-hidden="true" /></span>
    <span><strong>PHP account</strong><small>{maskedReference(account.reference)} · {account.status}</small></span>
    <strong className="row-value money">{formatPhp(account.minor)}</strong>
  </a>;
}

export function ActivityRow({ incoming, minor, label }: { incoming: boolean; minor: string; label: string }) {
  const Icon = incoming ? ArrowDownLeft : ArrowUpRight;
  return <div className="entry-row"><span className="icon-tile"><Icon size={21} aria-hidden="true" /></span>
    <span><strong>{incoming ? "Incoming transfer" : "Outgoing transfer"}</strong><small>{label}</small></span>
    <strong className="row-value money">{formatPhp(incoming ? minor : "-" + minor)}</strong></div>;
}

export function TransferSummary({ source, recipient, minor }: { source: string; recipient: string; minor: string }) {
  return <dl className="details">
    <div><dt>From account</dt><dd>{maskedReference(source)}</dd></div>
    <div><dt>Recipient reference</dt><dd className="verbatim">{recipient}</dd></div>
    <div><dt>Amount</dt><dd className="money">{formatPhp(minor)}</dd></div>
  </dl>;
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="panel"><header className="panel-heading"><h2>{title}</h2>{action}</header>{children}</section>;
}
