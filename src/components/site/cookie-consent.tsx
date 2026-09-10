"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

const STORAGE_KEY = "gg-cookie-consent";

// No external changes to subscribe to — the value only changes on dismiss,
// which re-renders via local state.
const subscribe = () => () => {};

/** True once the visitor has accepted/dismissed the notice (or if storage is unavailable). */
const hasResponded = () => {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable (private mode) — don't nag.
    return true;
  }
};

/**
 * Minimal, honest cookie banner. GlobalGrad only sets strictly-necessary
 * cookies (auth, language, theme), so this is a one-time acknowledgement rather
 * than a tracking gate — the choice is remembered in localStorage.
 *
 * `useSyncExternalStore` reads localStorage in an SSR-safe way: the server
 * snapshot is always "responded" (banner hidden), so hydration matches, then
 * the client reveals the banner only for a visitor who hasn't responded yet —
 * no `useEffect` + `setState` and no hydration mismatch.
 */
export function CookieConsent() {
  const responded = useSyncExternalStore(subscribe, hasResponded, () => true);
  const [dismissed, setDismissed] = useState(false);

  const dismiss = (value: "accepted" | "dismissed") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (responded || dismissed) return null;

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
