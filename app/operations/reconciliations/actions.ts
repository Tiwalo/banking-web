"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { symmetricDecrypt, symmetricEncrypt } from "better-auth/crypto";
import { isId } from "@/lib/api/generated/validate.cjs";
import { verifiedOperator } from "@/lib/auth/accounts";
import { required, trustedUrl } from "@/lib/auth/server";
import { displayFinding, type LookupState } from "@/lib/operations/findings";

export async function lookupFindings(_previous: LookupState, form: FormData): Promise<LookupState> {
  if ((await headers()).get("origin") !== trustedUrl("APP_ORIGIN").origin) redirect("/access-denied?area=operations");
  const operator = await verifiedOperator();
  if (!operator) return { error: "Operator access could not be verified. Sign in again or retry." };
  let run = String(form.get("run") ?? "").trim();
  const continuation = form.get("next");
  const key = required("BETTER_AUTH_SECRET") + ":w5-findings:" + operator.actor;
  let cursor: string | undefined;
  if (continuation !== null) {
    try {
      if (typeof continuation !== "string" || continuation.length > 2048) throw new Error();
      const saved = JSON.parse(await symmetricDecrypt({ key, data: continuation }));
      if (!isId(saved.run) || typeof saved.cursor !== "string" || !/^[0-9a-f]{64}$/.test(saved.cursor)) throw new Error();
      run = saved.run;
      cursor = saved.cursor;
    } catch { return { error: "This page link is unavailable. Look up the run again." }; }
  }
  if (!isId(run)) return { error: "Enter a valid run ID." };
  const result = await operator.api.listFindings(run, { limit: 20, cursor });
  if (!result.ok) {
    if (result.status === 401) redirect("/sign-in?expired=1");
    if (result.status === 403) redirect("/access-denied?area=operations");
    return { error: result.status === 404 ? "This run is unavailable. Check the run ID." : result.message };
  }
  const next = result.data.nextCursor && await symmetricEncrypt({ key, data: JSON.stringify({ run, cursor: result.data.nextCursor }) });
  return { run: "…" + run.slice(-8), findings: result.data.findings.map(displayFinding), next };
}
