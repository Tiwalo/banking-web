import "server-only";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes, randomUUID } from "node:crypto";
import type { components } from "../api/generated/banking";
import type { ApiResult } from "../api/problem";
import { isId, isTransferRequest } from "../api/generated/validate.cjs";
import { required, webDatabase } from "../auth/server";

export type Payment = components["schemas"]["TransferRequest"];
type Receipt = components["schemas"]["TransferReceipt"];
type Draft = { payment: Payment; key: string; receipt?: Receipt };
type State = "review" | "uncertain" | "posted" | "declined" | "conflict";
type Stored = { sealed: Buffer; state: State; decline_reason: string | null; retry_ready: boolean };

function cipherKey() {
  return Buffer.from(hkdfSync("sha256", required("BETTER_AUTH_SECRET"), "tiwalo-web", "transfer-draft:v1", 32));
}

function associatedData(actor: string, id: string) {
  return Buffer.from(JSON.stringify([actor, id.toLowerCase()]));
}

function seal(actor: string, id: string, draft: Draft) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cipherKey(), iv);
  cipher.setAAD(associatedData(actor, id));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(draft), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]);
}

function open(actor: string, id: string, sealed: Buffer): Draft {
  const cipher = createDecipheriv("aes-256-gcm", cipherKey(), sealed.subarray(0, 12));
  cipher.setAuthTag(sealed.subarray(12, 28));
  cipher.setAAD(associatedData(actor, id));
  const draft = JSON.parse(Buffer.concat([cipher.update(sealed.subarray(28)), cipher.final()]).toString("utf8")) as Draft;
  if (!isId(draft.key) || !isTransferRequest(draft.payment)) throw new Error("Invalid saved payment.");
  return draft;
}

export async function readDraft(actor: string, id: string) {
  if (!isId(id)) return null;
  const result = await webDatabase().query<Stored>(
    "SELECT sealed,state,decline_reason,retry_after <= now() AS retry_ready FROM tiwalo_web.transfer_draft WHERE actor=$1 AND id=$2 AND expires_at > now()", [actor, id]);
  const row = result.rows[0];
  return row ? { ...open(actor, id, row.sealed), state: row.state, reason: row.decline_reason, retryReady: row.retry_ready } : null;
}

export async function unresolvedPayments(actor: string) {
  const result = await webDatabase().query<{ id: string }>(
    "SELECT id FROM tiwalo_web.transfer_draft WHERE actor=$1 AND state IN ('uncertain','conflict') ORDER BY retry_after DESC, id", [actor]);
  return result.rows;
}

export async function submitDraft(actor: string, id: string, retry: boolean,
  dispatch: (payment: Payment, key: string) => Promise<ApiResult<Receipt>>) {
  if (!isId(id)) return;
  const db = webDatabase();
  const claim = randomUUID();
  // Commit the claim before dispatch so a crash at either boundary can be recovered.
  const claimed = await db.query<{ sealed: Buffer }>(
    `UPDATE tiwalo_web.transfer_draft SET state='uncertain', claim=$3,
       expires_at='infinity', retry_after=now() + interval '30 seconds'
     WHERE actor=$1 AND id=$2 AND expires_at > now() AND state=$4
       AND (state='review' OR retry_after <= now()) RETURNING sealed`,
    [actor, id, claim, retry ? "uncertain" : "review"]);
  if (!claimed.rows.length) return;
  const draft = open(actor, id, claimed.rows[0].sealed);
  const result = await dispatch(draft.payment, draft.key);
  let state: State = "uncertain";
  let reason = null;
  let sealed = claimed.rows[0].sealed;
  if (result.ok) {
    state = "posted";
    sealed = seal(actor, id, { ...draft, receipt: result.data });
  } else if (result.status === 409) {
    state = "conflict";
  } else if (result.status === 422 && ["insufficient-funds","transfer-limit","same-account","account-unavailable"].includes(result.kind)) {
    state = "declined";
    reason = result.message;
  }
  await db.query(
    `UPDATE tiwalo_web.transfer_draft SET state=$4, sealed=$5, decline_reason=$6, retry_after=now(),
       expires_at=CASE WHEN $4 IN ('posted','declined') THEN now() + interval '24 hours' ELSE expires_at END
     WHERE actor=$1 AND id=$2 AND claim=$3 AND state='uncertain'`,
    [actor, id, claim, state, sealed, reason]);
}

export async function saveDraft(actor: string, id: string, payment: Payment) {
  if (!isId(id) || !isTransferRequest(payment)) throw new Error("Invalid payment draft.");
  const db = webDatabase();
  await db.query("DELETE FROM tiwalo_web.transfer_draft WHERE expires_at <= now()");
  const data = seal(actor, id, { key: randomUUID(), payment });
  const inserted = await db.query(
    "INSERT INTO tiwalo_web.transfer_draft(actor,id,sealed) VALUES($1,$2,$3) ON CONFLICT (actor,id) DO NOTHING",
    [actor, id, data]);
  if (inserted.rowCount === 1) return true;
  // A repeated form submission may only resume the payload that won the insert.
  const saved = (await readDraft(actor, id))?.payment;
  return saved?.sourceAccountId === payment.sourceAccountId && saved.recipientReference === payment.recipientReference &&
    saved.currency === payment.currency && saved.amountMinor === payment.amountMinor;
}
