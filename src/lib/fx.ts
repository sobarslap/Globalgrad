/**
 * Live USD exchange rates from a keyless provider (open.er-api.com). Fetched
 * server-side (so no client CSP/connect-src concerns) and cached for 12h. Falls
 * back to a static table if the request fails, so the calculator always works.
 */

export type FxRates = Record<string, number>; // units of currency per 1 USD

const FALLBACK: FxRates = {
  USD: 1,
  BDT: 118,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.88,
  SEK: 10.6,
  INR: 83,
};

export const SUPPORTED_CURRENCIES = Object.keys(FALLBACK);

export async function getFxRates(): Promise<{ rates: FxRates; live: boolean }> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) throw new Error(`FX ${res.status}`);
    const data = (await res.json()) as { result?: string; rates?: FxRates };
    if (data.result !== "success" || !data.rates) throw new Error("FX payload");
    // Keep only the currencies we surface, always including USD.
    const rates: FxRates = { USD: 1 };
    for (const c of SUPPORTED_CURRENCIES) {
      if (typeof data.rates[c] === "number") rates[c] = data.rates[c];
    }
    return { rates, live: true };
  } catch {
    return { rates: FALLBACK, live: false };
  }
}
