import { auth } from "@/lib/auth/server";
import { acceptsForm, leave } from "@/lib/auth/form";

export async function POST(request: Request) {
  if (!acceptsForm(request)) return new Response(null, { status: 403 });
  const { headers, response } = await auth().api.signInSocial({
    headers: request.headers, returnHeaders: true,
    body: { provider: "keycloak", callbackURL: "/dashboard", errorCallbackURL: "/sign-in?error=1", disableRedirect: true },
  });
  if (!response.url) return new Response(null, { status: 503 });
  return leave(response.url, headers);
}
