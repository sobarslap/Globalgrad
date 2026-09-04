/**
 * Curated student-visa guidance (Module 4, F3). Illustrative reference content —
 * always confirm with the official embassy before applying. Could move to a
 * Content-Manager-editable DB model later.
 */
export interface VisaGuide {
  code: string;
  country: string;
  flag: string;
  visaName: string;
  requiredDocs: string[];
  financialProof: string;
  processingTimeline: string;
  visaFeeUsd: number;
  embassyUrl: string;
  commonMistakes: string[];
}

export const VISA_GUIDES: VisaGuide[] = [
  {
    code: "US",
    country: "United States",
    flag: "🇺🇸",
    visaName: "F-1 Student Visa",
    requiredDocs: [
      "Form I-20 from your university",
      "Valid passport (6+ months validity)",
      "DS-160 confirmation page",
      "SEVIS fee receipt (I-901)",
      "Visa application fee receipt",
      "Admission & financial documents",
    ],
    financialProof:
      "Show funds covering the first year of tuition + living (bank statements, sponsor letters, scholarship letters).",
    processingTimeline: "3–8 weeks; apply up to 365 days before your program start.",
    visaFeeUsd: 185,
    embassyUrl: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
    commonMistakes: [
      "Weak or inconsistent proof of funds",
      "Failing to convince the officer of ties to home country",
      "Booking flights before the visa is approved",
    ],
  },
  {
    code: "CA",
    country: "Canada",
    flag: "🇨🇦",
    visaName: "Study Permit",
    requiredDocs: [
      "Letter of acceptance from a DLI",
      "Valid passport",
      "Proof of funds (GIC + tuition)",
      "Statement of purpose",
      "Provincial Attestation Letter (PAL) if required",
    ],
    financialProof:
      "A GIC of ~CAD 20,635 plus first-year tuition, or equivalent bank proof.",
    processingTimeline: "Varies by country; often 4–12 weeks.",
    visaFeeUsd: 110,
    embassyUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
    commonMistakes: [
      "Missing the GIC or under-funding",
      "Vague statement of purpose",
      "Incomplete medical exam where required",
    ],
  },
  {
    code: "GB",
    country: "United Kingdom",
    flag: "🇬🇧",
    visaName: "Student Visa (formerly Tier 4)",
    requiredDocs: [
      "CAS from your university",
      "Valid passport",
      "Proof of funds (28-day rule)",
      "TB test certificate (some countries)",
      "ATAS certificate (some courses)",
    ],
    financialProof:
      "Tuition for one year + living costs held for 28 consecutive days (London vs outside differ).",
    processingTimeline: "Usually within 3 weeks of your biometrics appointment.",
    visaFeeUsd: 610,
    embassyUrl: "https://www.gov.uk/student-visa",
    commonMistakes: [
      "Funds not held the full 28 days",
      "Applying before receiving the CAS",
      "Forgetting the Immigration Health Surcharge",
    ],
  },
  {
    code: "DE",
    country: "Germany",
    flag: "🇩🇪",
    visaName: "National (D) Student Visa",
    requiredDocs: [
      "University admission letter",
      "Valid passport",
      "Blocked account proof (Sperrkonto)",
      "Health insurance",
      "Proof of language proficiency",
    ],
    financialProof:
      "A blocked account of ~€11,904 (one year) is the standard proof of funds.",
    processingTimeline: "6–12 weeks; book the embassy appointment early.",
    visaFeeUsd: 80,
    embassyUrl: "https://www.germany.info/us-en/service/visa",
    commonMistakes: [
      "Late blocked-account setup",
      "No valid health insurance",
      "Underestimating appointment wait times",
    ],
  },
  {
    code: "AU",
    country: "Australia",
    flag: "🇦🇺",
    visaName: "Student Visa (Subclass 500)",
    requiredDocs: [
      "Confirmation of Enrolment (CoE)",
      "Valid passport",
      "Genuine Student (GS) statement",
      "OSHC health cover",
      "Proof of funds & English proficiency",
    ],
    financialProof:
      "Show tuition + living (~AUD 29,710/year) + travel via bank statements or loans.",
    processingTimeline: "Often 4–8 weeks.",
    visaFeeUsd: 1050,
    embassyUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    commonMistakes: [
      "Weak Genuine Student statement",
      "Missing OSHC health cover",
      "Insufficient financial capacity evidence",
    ],
  },
];
