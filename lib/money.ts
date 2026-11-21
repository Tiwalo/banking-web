/** Format exact decimal-string centavos, including signed reconciliation evidence. */
export function formatPhp(minor: string): string {
  if (!/^(?:0|-?[1-9]\d*)$/.test(minor)) throw new RangeError("Invalid centavo string");
  const digits = minor.replace("-", "").padStart(3, "0");
  const pesos = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (minor.startsWith("-") ? "−₱" : "₱") + pesos + "." + digits.slice(-2);
}

/** Convert user-entered PHP to a positive signed-64-bit-compatible request amount. */
export function parseTransferAmount(pesos: string): string | undefined {
  const match = /^(\d{1,17})(?:\.(\d{1,2}))?$/.exec(pesos);
  if (!match) return;
  const minor = (match[1] + (match[2] ?? "").padEnd(2, "0")).replace(/^0+/, "");
  if (minor && BigInt(minor) <= BigInt("9223372036854775807")) return minor;
}
