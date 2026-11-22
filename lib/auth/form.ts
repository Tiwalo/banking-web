import "server-only";

export function acceptsForm(request: Request) {
  const origin = process.env.APP_ORIGIN;
  return Boolean(origin) && request.headers.get("origin") === origin;
}

export function leave(location: string, headers: Headers) {
  const response = new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "private, no-store" } });
  for (const cookie of headers.getSetCookie()) response.headers.append("Set-Cookie", cookie);
  return response;
}
