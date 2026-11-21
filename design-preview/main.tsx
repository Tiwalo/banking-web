import { useEffect, useState, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { Activity, BookOpen, ClipboardList, CreditCard, Files, Home, LayoutDashboard, ListChecks, ReceiptText, Search, Send, UserRound } from "lucide-react";
import { PortalShell, type NavigationItem } from "../components/PortalShell";
import { Panel } from "../components/BankingPanels";
import { AccountsView, ReceiptsView, SendView } from "./Customer";
import { OperationsView } from "./Operations";
import { initialDraft, receipt, runId } from "./fixtures";
import "../components/theme.css";
import "./portal.css";

const customer = [
  { label: "Dashboard", path: "/dashboard", icon: Home }, { label: "Accounts", path: "/accounts", icon: CreditCard },
  { label: "Send Money", path: "/transfers/new", icon: Send }, { label: "Transactions", path: "/transactions", icon: Activity },
  { label: "Receipts", path: "/receipts", icon: ReceiptText }, { label: "Profile", path: "/profile", icon: UserRound },
];
const operator = [
  { label: "Operations Dashboard", path: "/operations", icon: LayoutDashboard },
  { label: "Transactions", path: "/operations/transactions", icon: Activity },
  { label: "Investigation", path: "/operations/investigation", icon: Search },
  { label: "Ledger", path: "/operations/ledger", icon: BookOpen },
  { label: "Reconciliation", path: "/operations/reconciliations", icon: ListChecks },
  { label: "Audit Trail", path: "/operations/audit", icon: ClipboardList },
  { label: "Profile", path: "/operations/profile", icon: UserRound },
];
const scenarios = [
  ["Customer dashboard", "/dashboard"], ["Operations dashboard", "/operations"],
  ["Send Money", "/transfers/new"], ["Transfer review", "/transfers/review"], ["Submitting", "/transfers/submitting"],
  ["Definite decline", "/transfers/declined"], ["Uncertain outcome", "/transfers/pending"],
  ["Posted receipt", "/receipts/" + receipt.id], ["Reconciliation findings", "/operations/reconciliations/" + runId],
  ["Expired session", "/sign-in"], ["Access denied", "/access-denied"],
];
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function snapshot() { return window.location.hash.slice(1) || "/dashboard"; }
function Preview() {
  const location = useSyncExternalStore(subscribe, snapshot);
  const [path, variation] = location.split("?");
  const [draft, setDraft] = useState(initialDraft);
  const ops = path === "/operations" || path.startsWith("/operations/");
  const items = ops ? operator : customer;
  const screen = scenarios.find(([, target]) => target === path)?.[0] ?? items.find(item => item.path === path)?.label ?? "Preview screen";
  useEffect(() => { document.title = screen + " · Tiwalo design preview"; }, [screen]);
  const accounts = path === "/dashboard" || path === "/accounts" || path.startsWith("/accounts/");
  const findings = path.startsWith("/operations/reconciliations/");
  const variants = accounts ? ["Default", "Loading", "Empty", "Unavailable"] : findings ? ["Default", "Empty", "Unavailable", "Denied"] : ["Default"];
  const selected = new URLSearchParams(variation).get("state") ?? "Default";
  const state = variants.includes(selected) ? selected : "Default";
  const nav: NavigationItem[] = items.map(item => ({ ...item, href: "#" + item.path,
    active: path === item.path || (item.path !== "/operations" && path.startsWith(item.path + "/")) || (item.path === "/transfers/new" && path.startsWith("/transfers/")),
  }));
  function content() {
    if (accounts) return <AccountsView path={path} state={state} />;
    if (path.startsWith("/transfers/")) return <SendView path={path} draft={draft} setDraft={setDraft} />;
    if (path === "/receipts" || path.startsWith("/receipts/")) return <ReceiptsView path={path} />;
    if (path === "/operations" || path === "/operations/reconciliations" || findings) return <OperationsView path={path} state={state} />;
    if (path.endsWith("/profile")) return <><h1>Profile</h1><Panel title="Session details"><p>{ops ? "Operator" : "Customer"} · synthetic identity</p><p>Live profile details require a verified session.</p></Panel></>;
    if (path.endsWith("/signed-out") || path === "/access-denied" || path === "/sign-in") return <>
      <h1>{path === "/access-denied" ? "Access denied" : path === "/sign-in" ? "Session expired" : "Signed out"}</h1>
      <p className="intro">This design preview has no authenticated session.</p><a href={ops ? "#/operations" : "#/dashboard"}>Return to preview dashboard</a></>;
    const label = items.find(item => item.path === path)?.label ?? "Page unavailable";
    return <><h1>{label}</h1><section className="panel dependency"><Files aria-hidden="true" /><h2>Awaiting an API contract</h2>
      <p>{path.endsWith("/investigation") ? "Case search and investigation status are unavailable. Findings can be inspected using a known reconciliation run ID." : "The published API has no listing for this screen."}</p>
      {path.endsWith("/investigation") && <a href="#/operations/reconciliations">Find a reconciliation run</a>}</section></>;
  }
  return <PortalShell pageKey={path} area={ops ? "Operations" : "Customer"} navigation={nav} logoutHref={ops ? "#/operations/signed-out" : "#/signed-out"} toolbar={<div className="preview-tools">
    <strong>Design preview · synthetic data</strong>
    <label><span className="sr-only">Preview screen</span><select value={scenarios.some(([, target]) => target === path) ? path : ""} onChange={e => { window.location.hash = e.target.value; }}>
      <option value="" disabled>{screen}</option>{scenarios.map(([name, target]) => <option key={target} value={target}>{name}</option>)}</select></label>
    {variants.length > 1 && <label><span className="sr-only">Data state</span><select value={state} onChange={e => { window.location.hash = path + "?state=" + e.target.value; }}>{variants.map(v => <option key={v}>{v}</option>)}</select></label>}
  </div>}><div key={path}>{content()}</div></PortalShell>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
