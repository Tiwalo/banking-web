import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { customerAccounts } from "@/lib/auth/accounts";

export default async function Account({ params }: PageProps<"/accounts/[accountId]">) {
  const api = await customerAccounts();
  const result = await api.getAccount((await params).accountId);
  if (!result.ok) {
    if (result.status === 401) redirect("/sign-in?expired=1");
    if (result.status === 403) redirect("/access-denied");
    if (result.status === 404 || result.kind === "invalid-request") notFound();
  }
  return <section><h1>Account details</h1>
    {result.ok ? <p>{result.data.currency} account ending in {result.data.recipientReference.slice(-4)} · {result.data.status}</p>
      : <p role="alert">{result.message}</p>}
    <Link href="/dashboard">Your accounts</Link>
    <form method="post" action="/logout"><button className="action">Log out</button></form>
  </section>;
}
