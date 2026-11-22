import { auth } from "../../../lib/auth/server";
import { acceptsForm, leave } from "../../../lib/auth/form";

export async function POST(request: Request) {
  if (!acceptsForm(request)) return new Response(null, { status: 403 });
  try {
    const { headers, response } = await auth().api.signInSocial({
      headers: request.headers, returnHeaders: true,
      body: { provider: "keycloak", callbackURL: "/dashboard", errorCallbackURL: "/sign-in?error=1", disableRedirect: true },
    });
    if (response.url) return leave(response.url, headers);
  } catch {
    // Provider discovery or state storage can fail before a redirect exists.
  }
  return leave("/sign-in?error=1", new Headers());
}
