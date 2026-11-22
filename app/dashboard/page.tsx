import Link from "next/link";
import { redirect } from "next/navigation";
import { customerAccounts } from "@/lib/auth/accounts";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";

export default async function Dashboard({ searchParams }: PageProps<"/dashboard">) {
  const api = await customerAccounts();
  const { cursor } = await searchParams;
  if (!api) return <AccountAccessRecovery retryHref={typeof cursor === "string" ? "/dashboard?" + new URLSearchParams({ cursor }) : "/dashboard"} />;
  const page = await api.listAccounts(typeof cursor === "string" ? { cursor } : {});
  if (!page.ok && page.status === 401) redirect("/sign-in?expired=1");
  if (!page.ok && page.status === 403) redirect("/access-denied");
  return <section><h1>Your accounts</h1>
    {page.ok ? <>
      {page.data.accounts.length ? <ul>{page.data.accounts.map(account => <li key={account.accountId}>
        <Link prefetch={false} href={"/accounts/" + account.accountId}>
          PHP account ending in {account.recipientReference.slice(-4)}
        </Link> · {account.status}
      </li>)}</ul> : <p>No accounts on this page.</p>}
      {page.data.nextCursor && <Link prefetch={false} href={{ pathname: "/dashboard", query: { cursor: page.data.nextCursor } }}>Next accounts</Link>}
    </> : <p role="alert">{page.message} <Link href="/dashboard">Reload accounts</Link></p>}
    <form method="post" action="/logout"><button className="action">Log out</button></form>
  </section>;
}
