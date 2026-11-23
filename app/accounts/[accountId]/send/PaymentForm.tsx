"use client";
import { useActionState, useState } from "react";

export function PaymentForm({ action, recipient, amount }: {
  action: (previous: string, fields: FormData) => Promise<string>;
  recipient: string;
  amount: string;
}) {
  const [error, submit, pending] = useActionState(action, "");
  const [reference, setReference] = useState(recipient);
  const [pesos, setPesos] = useState(amount);
  return <form className="payment-form" action={submit}>
    <label>Recipient reference<input name="recipient" required value={reference} onChange={e => setReference(e.target.value)} autoComplete="off" spellCheck={false} /></label>
    <label>Amount (PHP)<input name="amount" required value={pesos} onChange={e => setPesos(e.target.value)} inputMode="decimal" autoComplete="off" /></label>
    {error && <p role="alert">{error}</p>}
    <button type="submit" className="action" disabled={pending}>{pending ? "Preparing review…" : "Review payment"}</button>
  </form>;
}
