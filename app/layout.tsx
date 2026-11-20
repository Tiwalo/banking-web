import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiwalo | Philippine banking simulation",
  description: "A Philippine banking project using synthetic customers and fictional pesos.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The framework scripts must carry the nonce for this request.
  await connection();

  return (
    <html lang="en-PH">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="masthead">
          <div className="frame masthead-inner">
            <Link className="wordmark" href="/" aria-label="Tiwalo home">
              Tiwalo<span aria-hidden="true">.</span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/#about">About the simulation</Link>
            </nav>
          </div>
        </header>
        <main id="main" className="frame" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
