"use client";

import { useEffect, useRef } from "react";

export function SignInForm({ start }: { start: boolean }) {
  const form = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);
  useEffect(() => {
    if (start && !submitted.current && form.current) {
      submitted.current = true;
      form.current.requestSubmit();
    }
  }, [start]);
  return <form ref={form} method="post" action="/sign-in/start">
    <button className="action">Sign in</button>
  </form>;
}
