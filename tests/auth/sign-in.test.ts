// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { POST } from "../../app/sign-in/start/route";
import { acceptsForm } from "../../lib/auth/form";
import { auth } from "../../lib/auth/server";

const { signInSocial } = vi.hoisted(() => ({ signInSocial: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("better-auth", () => ({ betterAuth: vi.fn(() => ({ api: { signInSocial } })) }));

function form(origin: string) {
  return new Request("https://bank.example/sign-in/start", { method: "POST", headers: { Origin: origin } });
}

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

it("compares browser origins with the validated and normalized app origin", () => {
  vi.stubEnv("APP_ORIGIN", "https://bank.example:443/");
  expect(acceptsForm(form("https://bank.example"))).toBe(true);
  expect(acceptsForm(form("https://other.example"))).toBe(false);
  expect(acceptsForm(form("null"))).toBe(false);
  vi.stubEnv("APP_ORIGIN", "invalid");
  expect(acceptsForm(form("invalid"))).toBe(false);
});

it("returns a local retry page on initiation failure and handles an idle database disconnect", async () => {
  vi.stubEnv("APP_ORIGIN", "https://bank.example/");
  vi.stubEnv("KEYCLOAK_ISSUER", "https://identity.example/realms/test");
  for (const name of ["WEB_DATABASE_URL", "KEYCLOAK_CLIENT_ID", "KEYCLOAK_CLIENT_SECRET", "BETTER_AUTH_SECRET"]) vi.stubEnv(name, "fixture");
  auth();
  const database = vi.mocked(betterAuth).mock.calls[0][0].database;
  if (!(database instanceof Pool)) throw new Error("Expected a PostgreSQL session pool");
  const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
  database.emit("error", new Error("private connection detail"));
  expect(diagnostic.mock.calls).toEqual([["An idle web session database connection was lost."]]);
  for (const failure of ["discovery failed", "state storage unavailable"]) {
    signInSocial.mockRejectedValueOnce(new Error(failure));
    const response = await POST(form("https://bank.example"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/sign-in?error=1");
    expect(response.headers.get("set-cookie")).toBeNull();
  }
  await database.end();
});
