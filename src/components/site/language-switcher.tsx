"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { locales, localeNames, LOCALE_COOKIE, type Locale } from "@/i18n/config";

/**
 * Locale switcher (C8). Writes the locale cookie the request config reads, then
 * refreshes so server components re-render in the chosen language. No routing
 * change — the URL stays the same.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();

  const change = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    start(() => router.refresh());
  };

  return (
    <label className="relative inline-flex items-center">
      <Languages className="pointer-events-none absolute left-2 h-4 w-4 text-muted-foreground" />
      <span className="sr-only">Change language</span>
      <select
        aria-label="Change language"
        value={locale}
        disabled={pending}
        onChange={(e) => change(e.target.value as Locale)}
        className="appearance-none rounded-md border border-border/60 bg-transparent py-1 pl-8 pr-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none disabled:opacity-60"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-background text-foreground">
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
