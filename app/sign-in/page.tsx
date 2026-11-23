import { headers } from "next/headers";
import { SignInForm } from "./SignInForm";

export default async function SignIn({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const site = (await headers()).get("sec-fetch-site");
  const start = !params.error && !params.expired && (site === "same-origin" || site === "none");
  return <section className="notice"><h1>Customer sign-in</h1>
    {params.expired && <p role="status">Your session expired. Sign in again to see your accounts.</p>}
    {params.error && <p role="alert">Sign-in could not be completed. Please try again.</p>}
    <SignInForm start={start} />
  </section>;
}
