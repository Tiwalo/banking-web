import { expect, test } from "vitest";
import { formatPhp, parseTransferAmount } from "../../lib/money";

test.each([
  ["0", "₱0.00"], ["1", "₱0.01"], ["500000", "₱5,000.00"], ["-1", "−₱0.01"],
  ["9007199254740993", "₱90,071,992,547,409.93"], ["9223372036854775808", "₱92,233,720,368,547,758.08"],
])("formats exact centavos %s", (minor, display) => expect(formatPhp(minor)).toBe(display));

test.each(["00", "1.2", "", " 1", "1e2", "-0"])("rejects invalid centavos %s", value => {
  expect(() => formatPhp(value)).toThrow(RangeError);
});

test("parses only representable positive transfer amounts", () => {
  expect(parseTransferAmount("0.01")).toBe("1");
  expect(parseTransferAmount("0001.2")).toBe("120");
  expect(parseTransferAmount("92233720368547758.07")).toBe("9223372036854775807");
  for (const amount of ["0", "0.00", "-1", "1.001", "1e2", "92233720368547758.08"]) {
    expect(parseTransferAmount(amount)).toBeUndefined();
  }
});
