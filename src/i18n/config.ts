// Supported UI locales (C8). English is the source/base; Bangla is provided for
// the international (esp. Bangladeshi) student audience. Add a locale by adding
// its code here and a matching messages/<code>.json file.
export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  bn: "বাংলা",
};

export const LOCALE_COOKIE = "globalgrad_locale";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
