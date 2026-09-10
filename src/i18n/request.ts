import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "./config";

/**
 * next-intl request config (C8), cookie-based (no i18n routing) so URLs are
 * unchanged and the i18n layer never collides with the CSP/auth middleware.
 * The locale is read from the LOCALE_COOKIE, defaulting to English.
 */
export default getRequestConfig(async () => {
  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
