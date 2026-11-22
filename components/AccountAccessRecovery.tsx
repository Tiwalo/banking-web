export function AccountAccessRecovery({ retryHref }: { retryHref: string }) {
  return <section className="notice">
    <h1>We couldn’t verify your account access.</h1>
    <p>Try loading this page again, or sign in to renew your session.</p>
    <a className="action" href={retryHref}>Retry loading</a>{" "}
    <a href="/sign-in">Sign in again</a>
  </section>;
}
