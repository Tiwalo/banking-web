import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AccountAccessRecovery } from "../../components/AccountAccessRecovery";

it("lets customers reload their current account page or start a new sign-in", () => {
  render(<AccountAccessRecovery retryHref="/dashboard?cursor=fixture" />);
  expect(screen.getByRole("link", { name: "Retry loading" }).getAttribute("href")).toBe("/dashboard?cursor=fixture");
  expect(screen.getByRole("link", { name: "Sign in again" }).getAttribute("href")).toBe("/sign-in");
});
