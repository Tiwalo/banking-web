import Link from "next/link";

export default function SignedOut() {
  return <section><h1>You’re signed out</h1><Link href="/sign-in">Sign in again</Link></section>;
}
