"use client";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en-PH">
      <head><title>Tiwalo | Site unavailable</title></head>
      <body>
        <main>
          <h1>Tiwalo could not load.</h1>
          <button type="button" onClick={retry}>Retry loading</button>
        </main>
      </body>
    </html>
  );
}
