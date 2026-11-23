import { notFound, redirect } from "next/navigation";
import { verifiedCustomer } from "@/lib/auth/accounts";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";
import { formatPhp } from "@/lib/money";

export default async function Receipt({ params }: PageProps<"/receipts/[transferId]">) {
  const customer = await verifiedCustomer("transfers:read");
  const { transferId } = await params;
  const href = "/receipts/" + encodeURIComponent(transferId);
  if (!customer) return <AccountAccessRecovery retryHref={href} />;
  const result = await customer.api.getReceipt(transferId);
  if (!result.ok) {
    if (result.status === 401) redirect("/sign-in?expired=1");
    if (result.status === 403) redirect("/access-denied");
    if (result.status === 404 || result.kind === "invalid-request") notFound();
    return <p role="alert">{result.message} <a href={href}>Retry receipt lookup</a></p>;
  }
  const receipt = result.data;
  return <section className="account-view"><h1>Payment receipt</h1><p>Simulated banking · fictional funds</p>
    <dl className="payment-summary"><dt>Status</dt><dd>Posted</dd>
      <dt>Amount</dt><dd className="money">{formatPhp(receipt.amountMinor)}</dd>
      <dt>Source account ID ending in</dt><dd>{receipt.sourceAccountId.slice(-4)}</dd>
      <dt>Recipient reference</dt><dd><bdi>{receipt.recipientReference}</bdi></dd>
      <dt>Transfer ID</dt><dd>{receipt.transferId}</dd>
      <dt>Posted at (UTC)</dt><dd>{new Date(receipt.postedAt).toISOString()}</dd></dl>
    <a href="/dashboard">Back to accounts</a></section>;
}
