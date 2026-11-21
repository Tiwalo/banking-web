import { useState } from "react";
import { FileSearch, ListChecks } from "lucide-react";
import { maskedReference, Panel, StatusBadge } from "../components/BankingPanels";
import { formatPhp } from "../lib/money";
import { findingPages, runId } from "./fixtures";

export function OperationsView({ path, state }: { path: string; state: string }) {
  const [value, setValue] = useState("");
  const [issue, setIssue] = useState("");
  const [page, setPage] = useState(0);
  const report = path.startsWith("/operations/reconciliations/");
  if (report && path !== "/operations/reconciliations/" + runId) return <h1>Run unavailable</h1>;
  if (report) return <><h1>Reconciliation findings</h1><p className="intro">Run {runId}</p>
    <Panel title="Finding evidence">
      {state !== "Default" ? <p role="status">{{ Empty: "No findings were recorded for this run.", Unavailable: "This run could not be loaded.", Denied: "You do not have permission to view this run." }[state]}</p> : <>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Run findings table">
          <table><caption>Findings for the selected run · page {page + 1}</caption><thead><tr><th scope="col">Finding</th><th scope="col">Reference</th><th scope="col">Recorded evidence</th></tr></thead>
          <tbody>{findingPages[page].map(finding => <tr key={finding.reference}>
            <th scope="row"><StatusBadge tone="negative">{finding.code}</StatusBadge></th><td>{maskedReference(finding.reference)}</td>
            <td>{finding.evidence.length ? finding.evidence.map(([label, minor]) => <div key={label}>{label} <b className="money">{formatPhp(minor)}</b></div>) : "Reference only"}</td>
          </tr>)}</tbody></table>
        </div>
        <div className="page-actions"><span role="status">Page {page + 1} of this fixture</span>
          {page > 0 && <button className="action secondary" onClick={() => setPage(page - 1)}>Previous page</button>}
          {page < findingPages.length - 1 && <button className="action secondary" onClick={() => setPage(page + 1)}>Next page</button>}</div>
      </>}
    </Panel></>;

  const dashboard = path === "/operations";
  return <><h1>{dashboard ? "Operations dashboard" : "Reconciliation"}</h1><p className="intro">Read-only reconciliation and investigation</p>
    <div className="ops-grid"><Panel title="Find a reconciliation run">
      <div className="panel-symbol"><FileSearch size={24} aria-hidden="true" /></div>
      <p>Enter a known run ID to inspect its recorded findings.</p>
      <form className="form-card" onSubmit={e => { e.preventDefault(); if (value === runId) window.location.hash = "/operations/reconciliations/" + runId; else setIssue("No fixture run matches that ID."); }}>
        <label>Run ID<input value={value} required onChange={e => { setValue(e.target.value); setIssue(""); }} /></label>
        <small>Example ID <code>{runId}</code></small>{issue && <p role="alert">{issue}</p>}
        <button className="action">View findings</button>
      </form></Panel>
      <Panel title="Investigation access"><div className="panel-symbol"><ListChecks size={24} aria-hidden="true" /></div>
        <p>Inspect masked finding references and the evidence captured during a run.</p>
        <dl className="details"><div><dt>Access</dt><dd>Read only</dd></div><div><dt>Lookup</dt><dd>Known run ID</dd></div></dl>
      </Panel></div>
  </>;
}
