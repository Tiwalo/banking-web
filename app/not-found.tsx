import Link from "next/link";

export default function NotFound() {
  return (
    <section className="notice">
      <h1>Page not found.</h1>
      <p>Check the address or return to the Tiwalo home page.</p>
      <Link className="action" href="/">Return home</Link>
    </section>
  );
}
