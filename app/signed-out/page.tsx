export default function SignedOut() {
  // Sign-in needs its own document's form-action and referrer policies.
  return <section><h1>You’re signed out</h1><a href="/sign-in">Sign in again</a></section>;
}
