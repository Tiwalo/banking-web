// @vitest-environment node
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { parse } from "yaml";
import { expect, expectTypeOf, test } from "vitest";
import type { components, operations } from "../../lib/api/generated/banking";
import { account, findings, page, problem, receipt, transfer } from "./fixtures";

const id = "urn:tiwalo:fixture-validation";
const document = parse(readFileSync(new URL("../../api/openapi/banking-v1.yaml", import.meta.url), "utf8"));
const ajv = new Ajv2020({ strict: false });
addFormats(ajv);
ajv.addSchema(document, id);

function accepts(pointer: string, value: unknown) {
  const validate = ajv.getSchema(id + "#" + pointer);
  if (!validate) throw Error("Missing contract schema " + pointer);
  return validate(value);
}

const json = "/content/application~1json/schema";
const problemJson = "/content/application~1problem+json/schema";
test("synthetic wire fixtures conform to the exact operation schemas in the vendored YAML", () => {
  for (const [pointer, value] of [
    ["/paths/~1accounts/get/responses/200" + json, page],
    ["/paths/~1accounts~1{accountId}/get/responses/200" + json, account],
    ["/paths/~1transfers/post/requestBody" + json, transfer],
    ["/paths/~1transfers/post/responses/201" + json, receipt],
    ["/paths/~1transfers~1{transferId}/get/responses/200" + json, receipt],
    ["/paths/~1operations~1reconciliations~1{runId}~1findings/get/responses/200" + json, findings],
    ["/paths/~1transfers/post/responses/409" + problemJson, problem(409, "IDEMPOTENCY_CONFLICT")],
    ["/paths/~1transfers/post/responses/422" + problemJson, problem(422, "INSUFFICIENT_FUNDS")],
    ["/paths/~1transfers/post/responses/503" + problemJson, problem(503, "TRANSFER_BUSY")],
  ] as const) expect(accepts(pointer, value), pointer).toBe(true);
});

test("contract distinguishes exact bounded centavos from unbounded signed diagnostic evidence", () => {
  type Decline = operations["createInternalTransfer"]["responses"][422]["content"]["application/problem+json"];
  expectTypeOf<Decline["status"]>().toEqualTypeOf<422>();
  expectTypeOf<Decline["code"]>().toEqualTypeOf<"INSUFFICIENT_FUNDS" | "TRANSFER_LIMIT_EXCEEDED" | "SAME_ACCOUNT" | "ACCOUNT_UNAVAILABLE">();
  const minor = "/components/schemas/MinorUnits";
  expectTypeOf<components["schemas"]["Account"]["availableBalanceMinor"]>().toEqualTypeOf<string>();
  expect(accepts(minor, "9223372036854775807")).toBe(true);
  for (const value of ["9223372036854775808", "-1", 1, "01"]) expect(accepts(minor, value)).toBe(false);
  expect(accepts("/components/schemas/EvidenceMinor", "-9223372036854775809")).toBe(true);
  expect(accepts("/paths/~1transfers/post/responses/422" + problemJson, problem(422, "TRANSFER_BUSY"))).toBe(false);
});
