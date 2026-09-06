"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "gg-cookie-consent";

/**
 * Minimal, honest cookie banner. GlobalGrad only sets strictly-necessary
 * cookies (auth, language, theme), so this is a one-time acknowledgement rather
 * than a tracking gate — the choice is remembered in localStorage. Rendered
 * only after mount to avoid a hydration mismatch and to stay hidden for anyone
 * who has already responded.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      // localStorage unavailable (private mode) — just don't nag.
    }
  }, []);

  const dismiss = (value: "accepted" | "dismissed") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-xl rounded-xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur sm:inset-x-auto sm:right-4 sm:left-auto"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use only strictly-necessary cookies for sign-in and your
          language/theme preferences. See our{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => dismiss("dismissed")}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => dismiss("accepted")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
