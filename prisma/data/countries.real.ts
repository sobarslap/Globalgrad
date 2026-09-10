/**
 * Country macro-data for the Country Decision Dashboard, cost calculator, and
 * visa hub.
 *
 * Provenance: post-study-work durations and part-time work rules from official
 * immigration sources; cost-of-living index is Numbeo-style (US = 100);
 * monthly living cost is a rough student estimate in USD. VERIFY current rules
 * on official immigration sites before relying on them.
 */

export interface RealCountry {
  name: string;
  code: string;
  flagEmoji: string;
  postStudyWorkMonths: number;
  monthlyLivingCostUsd: number;
  costOfLivingIndex: number;
  partTimeAllowed: boolean;
  workHoursPerWeek: number;
  currency: string;
  latitude: number;
  longitude: number;
}

export const realCountries: RealCountry[] = [
  { name: "United States", code: "US", flagEmoji: "🇺🇸", postStudyWorkMonths: 36, monthlyLivingCostUsd: 1600, costOfLivingIndex: 100, partTimeAllowed: true, workHoursPerWeek: 20, currency: "USD", latitude: 39.8, longitude: -98.6 },
  { name: "Canada", code: "CA", flagEmoji: "🇨🇦", postStudyWorkMonths: 36, monthlyLivingCostUsd: 1200, costOfLivingIndex: 72, partTimeAllowed: true, workHoursPerWeek: 24, currency: "CAD", latitude: 56.1, longitude: -106.3 },
  { name: "United Kingdom", code: "GB", flagEmoji: "🇬🇧", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1400, costOfLivingIndex: 78, partTimeAllowed: true, workHoursPerWeek: 20, currency: "GBP", latitude: 55.4, longitude: -3.4 },
  { name: "Germany", code: "DE", flagEmoji: "🇩🇪", postStudyWorkMonths: 18, monthlyLivingCostUsd: 1100, costOfLivingIndex: 70, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 51.2, longitude: 10.4 },
  { name: "Australia", code: "AU", flagEmoji: "🇦🇺", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1600, costOfLivingIndex: 83, partTimeAllowed: true, workHoursPerWeek: 24, currency: "AUD", latitude: -25.3, longitude: 133.8 },
  { name: "Switzerland", code: "CH", flagEmoji: "🇨🇭", postStudyWorkMonths: 6, monthlyLivingCostUsd: 2000, costOfLivingIndex: 122, partTimeAllowed: true, workHoursPerWeek: 15, currency: "CHF", latitude: 46.8, longitude: 8.2 },
  { name: "Sweden", code: "SE", flagEmoji: "🇸🇪", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1000, costOfLivingIndex: 74, partTimeAllowed: true, workHoursPerWeek: 40, currency: "SEK", latitude: 60.1, longitude: 18.6 },
  { name: "Netherlands", code: "NL", flagEmoji: "🇳🇱", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1200, costOfLivingIndex: 76, partTimeAllowed: true, workHoursPerWeek: 16, currency: "EUR", latitude: 52.1, longitude: 5.3 },
  { name: "Singapore", code: "SG", flagEmoji: "🇸🇬", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1400, costOfLivingIndex: 90, partTimeAllowed: true, workHoursPerWeek: 16, currency: "SGD", latitude: 1.35, longitude: 103.8 },
  { name: "Ireland", code: "IE", flagEmoji: "🇮🇪", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1300, costOfLivingIndex: 80, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 53.4, longitude: -8.2 },
  { name: "France", code: "FR", flagEmoji: "🇫🇷", postStudyWorkMonths: 24, monthlyLivingCostUsd: 1150, costOfLivingIndex: 74, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 46.2, longitude: 2.2 },
  { name: "New Zealand", code: "NZ", flagEmoji: "🇳🇿", postStudyWorkMonths: 36, monthlyLivingCostUsd: 1300, costOfLivingIndex: 77, partTimeAllowed: true, workHoursPerWeek: 20, currency: "NZD", latitude: -40.9, longitude: 174.9 },
  { name: "Belgium", code: "BE", flagEmoji: "🇧🇪", postStudyWorkMonths: 12, monthlyLivingCostUsd: 1100, costOfLivingIndex: 74, partTimeAllowed: true, workHoursPerWeek: 20, currency: "EUR", latitude: 50.5, longitude: 4.5 },
  { name: "Poland", code: "PL", flagEmoji: "🇵🇱", postStudyWorkMonths: 9, monthlyLivingCostUsd: 800, costOfLivingIndex: 50, partTimeAllowed: true, workHoursPerWeek: 20, currency: "PLN", latitude: 51.9, longitude: 19.1 },
];
