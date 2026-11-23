"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifiedCustomer } from "@/lib/auth/accounts";
import { trustedUrl } from "@/lib/auth/server";
import { submitDraft } from "@/lib/transfers/drafts";

export async function submitPayment(id: string, retry: boolean) {
  if ((await headers()).get("origin") !== trustedUrl("APP_ORIGIN").origin) redirect("/access-denied");
  const customer = await verifiedCustomer("transfers:create");
  if (customer) await submitDraft(customer.actor, id, retry, customer.api.createTransfer);
  redirect("/transfers/review/" + encodeURIComponent(id));
}
