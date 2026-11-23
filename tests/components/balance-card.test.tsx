import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { BalanceCard } from "../../components/BankingPanels";

afterEach(cleanup);

test.each([
  ["1", "₱0.01"],
  ["9223372036854775807", "₱92,233,720,368,547,758.07"],
])("displays %s centavos for the identified account", (minor, expected) => {
  render(<BalanceCard reference="synthetic-reference-1234" minor={minor} />);
  const card = screen.getByRole("region", { name: "Available balance" });
  expect(within(card).getByText(expected)).toBeTruthy();
  expect(card.textContent).toContain("•••• 1234");
  expect(card.textContent).not.toContain("synthetic-reference");
});
