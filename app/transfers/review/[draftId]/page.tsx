import { notFound, redirect } from "next/navigation";
import { verifiedCustomer } from "@/lib/auth/accounts";
import { readDraft } from "@/lib/transfers/drafts";
import { formatPhp } from "@/lib/money";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";
import { submitPayment } from "./actions";

export default async function Review({ params }: PageProps<"/transfers/review/[draftId]">) {
  const customer = await verifiedCustomer("transfers:create");
  const { draftId } = await params;
  const reviewHref = "/transfers/review/" + encodeURIComponent(draftId);
  if (!customer) return <AccountAccessRecovery retryHref={reviewHref} />;
  const draft = await readDraft(customer.actor, draftId);
  if (!draft) notFound();
  const payment = draft.payment;
  const source = await customer.api.getAccount(payment.sourceAccountId);
  if (!source.ok) {
    if (source.status === 401) redirect("/sign-in?expired=1");
    if (source.status === 403) redirect("/access-denied");
    if (source.status === 404) notFound();
    return <p role="alert">{source.message} <a href={reviewHref}>Reload payment details</a></p>;
  }
  const titles = { review: "Review payment", uncertain: "Payment outcome unconfirmed", declined: "Payment declined",
    conflict: "Payment needs investigation", posted: "Payment receipt" };
  return <section className="account-view"><h1>{titles[draft.state]}</h1>
    <p>Simulated banking · fictional funds</p>
    {draft.state === "review" && <p>Check the details before submitting.</p>}
    {draft.state === "uncertain" && <p role="status">Your payment may already have posted. Retrying with the same details and key can complete the original payment.</p>}
    {draft.state === "conflict" && <p role="alert">The banking service reported a payment key conflict. Contact the simulation operator before starting another payment.</p>}
    {draft.state === "declined" && <p role="status">{draft.reason}</p>}
    <dl className="payment-summary">
      <dt>From account</dt><dd>PHP account ending in {source.data.recipientReference.slice(-4)}</dd>
      <dt>Recipient reference</dt><dd className="recipient-reference"><bdi>{payment.recipientReference}</bdi></dd>
      <dt>Amount</dt><dd className="money">{formatPhp(payment.amountMinor)}</dd>
      {draft.receipt && <><dt>Status</dt><dd>Posted</dd><dt>Transfer ID</dt><dd>{draft.receipt.transferId}</dd>
        <dt>Posted at (UTC)</dt><dd>{new Date(draft.receipt.postedAt).toISOString()}</dd>
        <dt>Current available balance</dt><dd>{formatPhp(source.data.availableBalanceMinor)}</dd></>}
    </dl>
    {draft.state === "review" && <><form action={submitPayment.bind(null, draftId, false)}><button className="action">Submit payment</button></form>
      <a href={"/accounts/" + payment.sourceAccountId + "/send?edit=" + draftId}>Edit payment</a></>}
    {draft.state === "uncertain" && (draft.retryReady
      ? <form action={submitPayment.bind(null, draftId, true)}><button className="action">Retry original payment</button></form>
      : <p>A submission may still be in progress. <a href={reviewHref}>Refresh payment status</a> in 30 seconds.</p>)}
    <a href="/dashboard">Back to accounts</a>
    {customer.canReadReceipts && <a href={draft.receipt ? "/receipts/" + draft.receipt.transferId : "/receipts"}>Look up a receipt</a>}
  </section>;
}
