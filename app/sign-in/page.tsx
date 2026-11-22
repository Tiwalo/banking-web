export default async function SignIn({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  return <section><h1>Customer sign-in</h1>
    {params.expired && <p role="status">Your session expired. Sign in again to see your accounts.</p>}
    {params.error && <p role="alert">Sign-in could not be completed. Please try again.</p>}
    <p>Use your synthetic Tiwalo identity to view your simulation accounts.</p>
    <form method="post" action="/sign-in/start"><button className="action">Continue with Keycloak</button></form>
  </section>;
}
