import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import PageError from "../../app/error";
import NotFound from "../../app/not-found";
import Home from "../../app/page";

afterEach(cleanup);

test("discloses fictional funds and links to the project", () => {
  render(<Home />);
  expect(screen.getByText(/cannot accept deposits or move real money/i)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Explore the project" }).getAttribute("href"))
    .toBe("https://github.com/Tiwalo/banking-web");
});

test("offers a route home from a missing page", () => {
  render(<NotFound />);
  expect(screen.getByRole("link", { name: "Return home" }).getAttribute("href")).toBe("/");
});

test("retries the page read once for each keyboard activation", async () => {
  const user = userEvent.setup();
  const retry = vi.fn();
  render(<PageError retry={retry} />);
  await user.tab();
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Retry loading" }));
  expect(retry).not.toHaveBeenCalled();
  await user.keyboard("{Enter}");
  expect(retry).toHaveBeenCalledTimes(1);
});
