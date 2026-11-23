import { notFound } from "next/navigation";
import { isId } from "@/lib/api/generated/validate.cjs";
import { FindingsLookup } from "../FindingsLookup";

export default async function Run({ params }: PageProps<"/operations/reconciliations/[runId]">) {
  const { runId } = await params;
  if (!isId(runId)) notFound();
  return <FindingsLookup runId={runId} />;
}
