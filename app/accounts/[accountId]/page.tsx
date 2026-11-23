import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { customerAccounts } from "@/lib/auth/accounts";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";
import { BalanceCard } from "@/components/BankingPanels";

export default async function Account({ params }: PageProps<"/accounts/[accountId]">) {
  const api = await customerAccounts();
  const { accountId } = await params;
  if (!api) return <AccountAccessRecovery retryHref={"/accounts/" + encodeURIComponent(accountId)} />;
  const result = await api.getAccount(accountId);
  if (!result.ok) {
    if (result.status === 401) redirect("/sign-in?expired=1");
    if (result.status === 403) redirect("/access-denied");
    if (result.status === 404 || result.kind === "invalid-request") notFound();
  }
  return <section className="account-view"><h1>Account details</h1>
    <p>Simulated banking · fictional funds</p>
    {result.ok ? <>
      <BalanceCard reference={result.data.recipientReference} minor={result.data.availableBalanceMinor} />
      <p>Account status · {result.data.status}</p>
      <a className="action secondary" href={"/accounts/" + result.data.accountId}>Refresh balance</a>
    </>
      : <p role="alert">{result.message}</p>}
    <Link href="/dashboard">Your accounts</Link>
    <form method="post" action="/logout"><button className="action">Log out</button></form>
  </section>;
}
