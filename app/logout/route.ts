import { auth, required, trustedUrl } from "@/lib/auth/server";
import { acceptsForm, leave } from "@/lib/auth/form";

export async function POST(request: Request) {
  if (!acceptsForm(request)) return new Response(null, { status: 403 });
  const session = await auth().api.getSession({ headers: request.headers });
  const { headers } = session
    ? await auth().api.revokeSession({ headers: request.headers, body: { token: session.session.token }, returnHeaders: true })
    : await auth().api.signOut({ headers: request.headers, returnHeaders: true });
  const issuer = trustedUrl("KEYCLOAK_ISSUER").href.replace(/\/$/, "");
  const logout = new URL(issuer + "/protocol/openid-connect/logout");
  logout.searchParams.set("client_id", required("KEYCLOAK_CLIENT_ID"));
  logout.searchParams.set("post_logout_redirect_uri", trustedUrl("APP_ORIGIN").origin + "/signed-out");
  return leave(logout.href, headers);
}
