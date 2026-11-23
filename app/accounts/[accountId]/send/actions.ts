"use server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { verifiedCustomer } from "@/lib/auth/accounts";
import { trustedUrl } from "@/lib/auth/server";
import { isTransferRequest } from "@/lib/api/generated/validate.cjs";
import { parseTransferAmount } from "@/lib/money";
import { saveDraft } from "@/lib/transfers/drafts";

export async function preparePayment(accountId: string, draftId: string, previous: string, fields: FormData) {
  if ((await headers()).get("origin") !== trustedUrl("APP_ORIGIN").origin) return "Open this form on the Tiwalo site and try again.";
  const customer = await verifiedCustomer("transfers:create");
  if (!customer) return "Account access could not be verified. Sign in again or retry.";
  const recipient = fields.get("recipient");
  const pesos = fields.get("amount");
  const minor = typeof pesos === "string" && parseTransferAmount(pesos);
  if (!minor) return "Enter a positive PHP amount with up to two decimal places.";
  if (typeof recipient !== "string") return "Enter the exact recipient reference.";
  const payment = { sourceAccountId: accountId, recipientReference: recipient, currency: "PHP" as const, amountMinor: minor };
  if (!isTransferRequest(payment)) return "Check the recipient reference and payment details.";
  const source = await customer.api.getAccount(accountId);
  if (!source.ok) {
    if (source.status === 401) redirect("/sign-in?expired=1");
    if (source.status === 403) redirect("/access-denied");
    if (source.status === 404 || source.kind === "invalid-request") notFound();
    return source.message;
  }
  if (!(await saveDraft(customer.actor, draftId, payment))) {
    return "This form already has different saved details. Reopen Send money to start a new review.";
  }
  redirect("/transfers/review/" + draftId);
}
