import Link from "next/link";
import { redirect } from "next/navigation";
import { customerAccounts } from "@/lib/auth/accounts";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";
import { BalanceCard } from "@/components/BankingPanels";

export default async function Dashboard({ searchParams }: PageProps<"/dashboard">) {
  const api = await customerAccounts();
  const { cursor } = await searchParams;
  const currentPage = typeof cursor === "string" ? "/dashboard?" + new URLSearchParams({ cursor }) : "/dashboard";
  if (!api) return <AccountAccessRecovery retryHref={currentPage} />;
  const page = await api.listAccounts(typeof cursor === "string" ? { cursor } : {});
  if (!page.ok && page.status === 401) redirect("/sign-in?expired=1");
  if (!page.ok && page.status === 403) redirect("/access-denied");
  return <section className="account-view"><h1>Your accounts</h1>
    <p>Simulated banking · fictional funds</p>
    {page.ok ? <>
      {page.data.accounts.length ? <ul className="account-grid">{page.data.accounts.map(account => <li key={account.accountId}>
        <BalanceCard reference={account.recipientReference} minor={account.availableBalanceMinor} />
        <Link prefetch={false} href={"/accounts/" + account.accountId}>
          PHP account ending in {account.recipientReference.slice(-4)}
        </Link> · {account.status}
      </li>)}</ul> : <p>No accounts on this page.</p>}
      {page.data.nextCursor && <Link prefetch={false} href={{ pathname: "/dashboard", query: { cursor: page.data.nextCursor } }}>Next accounts</Link>}
      <a className="action secondary" href={currentPage}>Refresh balances</a>
    </> : <p role="alert">{page.message} <a href={currentPage}>Reload accounts</a></p>}
    <form method="post" action="/logout"><button className="action">Log out</button></form>
  </section>;
}
