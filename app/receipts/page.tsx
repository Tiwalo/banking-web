import { redirect } from "next/navigation";
import { verifiedCustomer } from "@/lib/auth/accounts";
import { isId } from "@/lib/api/generated/validate.cjs";
import { AccountAccessRecovery } from "@/components/AccountAccessRecovery";

export default async function ReceiptLookup({ searchParams }: PageProps<"/receipts">) {
  if (!await verifiedCustomer("transfers:read")) return <AccountAccessRecovery retryHref="/receipts" />;
  const { id } = await searchParams;
  if (typeof id === "string" && isId(id.trim())) redirect("/receipts/" + id.trim());
  return <section className="account-view"><h1>Find a payment receipt</h1>
    {id !== undefined && <p role="alert">Enter a valid transfer ID.</p>}
    <form action="/receipts"><label htmlFor="transfer-id">Transfer ID</label>
      <input id="transfer-id" name="id" required maxLength={36} /><button className="action">Find receipt</button></form>
    <a href="/dashboard">Back to accounts</a></section>;
}
