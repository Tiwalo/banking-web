import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import standalone from "ajv/dist/standalone/index.js";
import addFormats from "ajv-formats";
import openapiTS, { astToString } from "openapi-typescript";
import { parse } from "yaml";

const root = new URL("../", import.meta.url);
const pin = JSON.parse(await readFile(new URL("api/openapi/pin.json", root), "utf8"));
if (!/^[0-9a-f]{40}$/.test(pin.revision)) throw new Error("Pin an immutable backend Git commit.");
const source = await readFile(new URL(pin.path, root));
const digest = createHash("sha256").update(source).digest("hex");
if (digest !== pin.sha256) throw new Error("Vendored OpenAPI bytes differ from the immutable pin.");
const spec = parse(source.toString("utf8"));
if (spec.openapi !== pin.openapi || spec.info.version !== pin.apiVersion) {
  throw new Error("OpenAPI metadata differs from the pin.");
}

const directory = new URL("lib/api/generated/", root);
const check = process.argv[2] === "--check";
if (!check) await mkdir(directory, { recursive: true });

async function output(name, contents) {
  const file = new URL(name, directory);
  if (check) {
    const existing = await readFile(file, "utf8");
    if (existing !== contents) throw new Error(name + " has drifted. Run npm run contract:generate.");
  } else {
    await writeFile(file, contents, "utf8");
  }
}

const header = `/* Generated from banking-core-api@${pin.revision}. Run npm run contract:generate to refresh. */\n`;
// The generator treats a bare $ref as final. Express the OpenAPI 3.1 Problem
// refinements as equivalent intersections so status and code stay narrow in TypeScript.
const typeInput = JSON.parse(JSON.stringify(spec, (_key, node) => {
  if (node?.$ref !== "#/components/schemas/Problem" || !node.properties) return node;
  const { $ref, ...constraints } = node;
  return { allOf: [{ $ref }, { type: "object", ...constraints }] };
}));
await output("banking.d.ts", header + astToString(await openapiTS(typeInput)));

// Compile only the wire shapes used by the adapter. Runtime validation needs no YAML or code generation.
const id = "urn:tiwalo:banking-v1";
const ajv = new Ajv2020({ strict: false, code: { source: true, lines: true } });
addFormats(ajv);
ajv.addSchema(spec, id);
const pointers = {
  isId: "/components/schemas/Id",
  isAccount: "/components/schemas/Account",
  isAccountPage: "/paths/~1accounts/get/responses/200/content/application~1json/schema",
  isTransferRequest: "/components/schemas/TransferRequest",
  isIdempotencyKey: "/paths/~1transfers/post/parameters/0/schema",
  isTransferReceipt: "/components/schemas/TransferReceipt",
  isFindingsPage: "/paths/~1operations~1reconciliations~1{runId}~1findings/get/responses/200/content/application~1json/schema",
  isProblem: "/components/schemas/Problem",
};
const exports = {};
for (const [name, pointer] of Object.entries(pointers)) {
  // A misspelled JSON pointer must fail at generation, before an adapter can be built.
  const key = id + ":" + name;
  ajv.addSchema({ $ref: id + "#" + pointer }, key);
  exports[name] = key;
}
await output("validate.cjs", header + standalone.default(ajv, exports) + "\n");
console.log((check ? "Verified" : "Generated") + " API " + pin.apiVersion + " from " + pin.revision + " (" + digest + ").");
