"use client";
import { useActionState, useState } from "react";
import { lookupFindings } from "./actions";

export function FindingsLookup({ runId = "" }: { runId?: string }) {
  const [state, submit, pending] = useActionState(lookupFindings, null);
  const [enteredRun, setEnteredRun] = useState(runId);
  return <><h1>Reconciliation findings</h1><p>Each lookup and page request is audited.</p>
    <form className="payment-form" action={submit}><label>Run ID<input name="run" required value={enteredRun}
      onChange={event => setEnteredRun(event.target.value)} maxLength={36} /></label>
      <button className="action" disabled={pending}>Look up findings</button></form>
    {pending && <p role="status">Loading findings…</p>}
    {!pending && state && ("error" in state ? <p role="alert">{state.error}</p> : <>
      <p role="status">{state.findings.length ? `Showing ${state.findings.length} findings for run ${state.run} on this page.` : `No findings for run ${state.run}.`}</p>
      {state.findings.length > 0 && <div className="ops-table" role="region" tabIndex={0} aria-label="Scrollable findings">
        <table><caption>Findings for run {state.run}</caption><thead><tr>
          <th scope="col">Reference ending</th><th scope="col">Check</th><th scope="col">Recorded evidence</th>
        </tr></thead><tbody>{state.findings.map((row, index) => <tr key={index}>
          <th scope="row">{row.reference}</th><td>{row.check}</td><td>{row.evidence.join(" · ") || "Reference only"}</td>
        </tr>)}</tbody></table></div>}
      {state.next && <form action={submit}><input type="hidden" name="next" value={state.next} /><button className="action">Next findings</button></form>}
    </>)}</>;
}
