import "server-only";
import { trustedUrl } from "./server";

export function acceptsForm(request: Request) {
  try {
    return request.headers.get("origin") === trustedUrl("APP_ORIGIN").origin;
  } catch {
    return false;
  }
}

export function leave(location: string, headers: Headers) {
  const response = new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "private, no-store" } });
  for (const cookie of headers.getSetCookie()) response.headers.append("Set-Cookie", cookie);
  return response;
}
