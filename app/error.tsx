"use client";

export default function PageError({ retry }: { retry: () => void }) {
  return (
    <section className="notice">
      <h1>This page could not load.</h1>
      <button className="action" type="button" onClick={retry}>Retry loading</button>
    </section>
  );
}
