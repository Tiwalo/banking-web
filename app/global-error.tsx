"use client";
import { Wordmark } from "../components/Wordmark";
import "./globals.css";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en-PH">
      <head><title>Tiwalo | Site unavailable</title></head>
      <body>
        <main className="frame notice">
          <Wordmark />
          <h1>Tiwalo could not load.</h1>
          <p>This simulated banking site uses fictional funds.</p>
          <button className="action" type="button" onClick={retry}>Retry loading</button>
        </main>
      </body>
    </html>
  );
}
