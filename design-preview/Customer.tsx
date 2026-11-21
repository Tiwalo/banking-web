import { ArrowRight, CreditCard, ReceiptText, Send } from "lucide-react";
import { useRef, useState } from "react";
import { AccountRow, ActivityRow, BalanceCard, maskedReference, Panel, StatusBadge, TransferSummary } from "../components/BankingPanels";
import { parseTransferAmount } from "../lib/money";
import { accounts, receipt, type Draft } from "./fixtures";

export function AccountsView({ path, state }: { path: string; state: string }) {
  const dashboard = path === "/dashboard";
  const selected = accounts.find(account => path === "/accounts/" + account.id);
  if (path.startsWith("/accounts/") && !selected) return <h1>Account unavailable</h1>;
  const shown = selected ?? accounts[0];
  return <>
    <h1>{dashboard ? "Welcome back" : selected ? "Account details" : "Accounts"}</h1>
    <p className="intro">{dashboard ? "Your account overview" : selected ? "PHP account · " + maskedReference(selected.reference) : "Your PHP accounts and their available balances."}</p>
    {state !== "Default" ? <Panel title="Account overview">
      <p role="status">{{
        Loading: "Loading account balances…", Empty: "No accounts are available.", Unavailable: "Account balances could not be loaded.",
      }[state]}</p>
      {state === "Loading" && <div className="account-skeleton" aria-hidden="true"><span /><span /></div>}
    </Panel> : <>
      <BalanceCard reference={shown.reference} minor={shown.minor} />
      {dashboard && <div className="quick-actions">
        <a className="action" href="#/transfers/new"><Send size={18} />Send Money</a>
        <a className="action secondary" href="#/accounts"><CreditCard size={18} />View Accounts</a>
        <a className="action secondary" href="#/receipts"><ReceiptText size={18} />Find a receipt</a>
      </div>}
      <div className={dashboard ? "panel-grid" : "section-stack"}>
        <Panel title={selected ? "Account information" : "My accounts"} action={dashboard && <a href="#/accounts">View all <ArrowRight size={14} /></a>}>
          {(selected ? [selected] : accounts).map(account => <AccountRow key={account.id} account={account} href={"#/accounts/" + account.id} />)}
        </Panel>
        {dashboard && <Panel title="Recent activity"><p className="helper">Sample layout · Account history awaits an API contract.</p>
          <ActivityRow incoming minor="32500" label="Synthetic example" /><ActivityRow incoming={false} minor="8500" label="Synthetic example" />
        </Panel>}
      </div>
    </>}
  </>;
}

export function SendView({ path, draft, setDraft }: { path: string; draft: Draft; setDraft: (draft: Draft) => void }) {
  const [retryView, setRetryView] = useState<"options" | "review" | "done">("options");
  const [invalidField, setInvalidField] = useState<"amount" | "recipient">();
  const recipientInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);
  const minor = parseTransferAmount(draft.pesos);
  if (path === "/transfers/new") return <>
    <h1>Send Money</h1><p className="intro">Internal PHP transfer</p>
    <form className="panel form-card" noValidate onSubmit={event => {
      event.preventDefault();
      if (!draft.recipient.length || draft.recipient.length > 128) { setInvalidField("recipient"); recipientInput.current?.focus(); return; }
      if (!minor) { setInvalidField("amount"); amountInput.current?.focus(); return; }
      window.location.hash = "/transfers/review";
    }}>
      <label>From account<select value={draft.source} onChange={e => setDraft({ ...draft, source: e.target.value })}>
        {accounts.filter(account => account.status === "Active").map(account => <option key={account.id} value={account.reference}>PHP account · {maskedReference(account.reference)}</option>)}
      </select></label>
      <label>Recipient reference<input ref={recipientInput} aria-invalid={invalidField === "recipient"} value={draft.recipient} maxLength={128} onChange={e => setDraft({ ...draft, recipient: e.target.value })} aria-describedby={invalidField === "recipient" ? "recipient-help transfer-error" : "recipient-help"} /></label>
      <small id="recipient-help">Use the exact reference supplied by the recipient.</small>
      <label>Amount (PHP)<input ref={amountInput} aria-invalid={invalidField === "amount"} aria-describedby={invalidField === "amount" ? "transfer-error" : undefined} inputMode="decimal" value={draft.pesos} onChange={e => setDraft({ ...draft, pesos: e.target.value })} /></label>
      {invalidField && <p id="transfer-error" role="alert">{invalidField === "amount" ? "Enter a positive PHP amount with up to two decimal places and within the supported range." : "Enter the recipient reference exactly as supplied (1–128 characters)."}</p>}
      <button className="action" type="submit">Review transfer</button>
    </form></>;
  if (path === "/transfers/review") return <><h1>Review transfer</h1><p className="intro">Check the source, recipient reference, and amount.</p>
    <section className="panel form-card" aria-label="Transfer review">
      {minor && draft.recipient ? <><TransferSummary source={draft.source} recipient={draft.recipient} minor={minor} />
      <p className="helper">Preview submission sends no banking request.</p>
      <button type="button" className="action" onClick={() => { window.location.hash = "/transfers/submitting"; }}>Submit preview</button></> : <p>Complete the payment details to review this transfer.</p>}
      <a href="#/transfers/new">Edit payment details</a>
    </section></>;
  const declined = path === "/transfers/declined";
  const submitting = path === "/transfers/submitting";
  return <><h1>{submitting ? "Submitting transfer" : declined ? "Transfer declined" : "Transfer outcome unknown"}</h1>
    <section className="panel form-card" aria-label="Transfer outcome" role="status">
      <StatusBadge tone={declined ? "negative" : "pending"}>{declined ? "Declined" : submitting ? "Submitting" : "Awaiting verification"}</StatusBadge>
      <p>{declined ? "Insufficient funds. This example shows a definite decline." : submitting ? "Submission is in progress. Wait for a verified result before taking further action." : "The connection ended before a result was received. The original transfer may have posted."}</p>
      {!declined && !submitting && <>
        <p>When a transfer ID is known, check its receipt. Otherwise, recovery reuses the original payment details and key. Retrying can complete that original payment.</p>
        <a href="#/receipts">Find receipt by transfer ID</a>
        {retryView === "options" && <button type="button" className="action secondary" onClick={() => setRetryView("review")}>Review same-key retry</button>}
        {retryView === "review" && <div><p>An identical retry can complete the original transfer. This design example sends no request.</p>
          <button type="button" className="action secondary" onClick={() => setRetryView("done")}>Preview identical retry</button></div>}
        {retryView === "done" && <p>Retry preview finished. The transfer outcome remains unknown.</p>}
      </>}
      <p className="helper">Use the preview state selector to inspect another outcome.</p>
    </section></>;
}

export function ReceiptsView({ path }: { path: string }) {
  const [id, setId] = useState("");
  const [missing, setMissing] = useState(false);
  if (path === "/receipts") return <><h1>Find a receipt</h1><p className="intro">Look up a single transfer by its ID.</p>
    <form className="panel form-card" onSubmit={e => { e.preventDefault(); if (id === receipt.id) window.location.hash = "/receipts/" + receipt.id; else setMissing(true); }}>
      <label>Transfer ID<input value={id} required onChange={e => { setId(e.target.value); setMissing(false); }} /></label>
      <small>Example ID <code>{receipt.id}</code></small>
      {missing && <p role="alert">No fixture receipt matches that ID.</p>}<button className="action">Find receipt</button>
    </form></>;
  if (path !== "/receipts/" + receipt.id) return <h1>Receipt unavailable</h1>;
  return <><h1>Transfer receipt</h1><p className="intro">Internal PHP transfer</p>
    <article className="panel form-card receipt"><StatusBadge tone="positive">Posted</StatusBadge>
      <TransferSummary source={receipt.source} recipient={receipt.recipient} minor={receipt.minor} />
      <dl className="details"><div><dt>Transfer ID</dt><dd>{receipt.id}</dd></div><div><dt>Posted at</dt><dd><time dateTime={receipt.postedAt}>{new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(receipt.postedAt))} (Manila)</time></dd></div></dl>
      <button className="action secondary print-control" onClick={() => window.print()}>Print receipt</button>
    </article></>;
}
