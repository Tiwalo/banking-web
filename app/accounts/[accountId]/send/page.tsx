import { randomUUID } from "node:crypto";
import { notFound, redirect } from "next/navigation";
import { verifiedCustomer } from "@/lib/auth/accounts";
import { readDraft } from "@/lib/transfers/drafts";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";
import { formatPhp } from "@/lib/money";
import { preparePayment } from "./actions";
import { PaymentForm } from "./PaymentForm";

export default async function SendMoney({ params, searchParams }: PageProps<"/accounts/[accountId]/send">) {
  const customer = await verifiedCustomer("transfers:create");
  const { accountId } = await params;
  const href = "/accounts/" + encodeURIComponent(accountId);
  if (!customer) return <AccountAccessRecovery retryHref={href + "/send"} />;
  const result = await customer.api.getAccount(accountId);
  if (!result.ok) {
    if (result.status === 401) redirect("/sign-in?expired=1");
    if (result.status === 403) redirect("/access-denied");
    if (result.status === 404 || result.kind === "invalid-request") notFound();
    return <p role="alert">{result.message} <a href={href + "/send"}>Retry</a></p>;
  }
  const edit = (await searchParams).edit;
  const original = typeof edit === "string" ? await readDraft(customer.actor, edit) : null;
  if (edit && original?.payment.sourceAccountId !== accountId) notFound();
  if (original && original.state !== "review") redirect("/transfers/review/" + edit);
  return <section className="account-view"><h1>Send money</h1>
    <p>From PHP account ending in {result.data.recipientReference.slice(-4)}</p>
    <p>Enter the destination account’s exact recipient reference. All funds are fictional.</p>
    <PaymentForm action={preparePayment.bind(null, accountId, randomUUID())}
      recipient={original?.payment.recipientReference ?? ""}
      amount={original ? formatPhp(original.payment.amountMinor).replace(/[₱,]/g, "") : ""} />
    <a href={href}>Back to account</a>
  </section>;
}
