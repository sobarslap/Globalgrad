import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollHelpers } from "@/components/site/scroll-helpers";
import { CookieConsent } from "@/components/site/cookie-consent";
import { SiteBackground } from "@/components/site/site-background";
import { SITE, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase makes every relative canonical/OG URL resolve to an absolute
  // one — without it, og:image and canonical tags are omitted or wrong.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    // Per-page `title: "Cost"` renders as "Cost — GlobalGrad".
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "study abroad",
    "university matching",
    "scholarship eligibility",
    "student visa",
    "cost of studying abroad",
    "international students",
    "study abroad advisor",
  ],
  authors: [{ name: "Zubairul Islam" }],
  creator: "Zubairul Islam",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE_URL,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The middleware sets a per-request nonce (B1); pass it to next-themes so its
  // pre-hydration inline script carries the nonce and isn't blocked by the CSP.
  // Reading headers() also opts the whole tree into dynamic rendering, which
  // nonce-based CSP requires.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const locale = await getLocale();

  // Structured data (Organization + WebSite + SoftwareApplication). Helps search
  // engines and AI assistants understand what GlobalGrad is. Carries the CSP
  // nonce so the strict script-src policy doesn't drop it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE.name,
        url: SITE_URL,
        email: SITE.email,
        logo: `${SITE_URL}/icon`,
        sameAs: [SITE.social.github, SITE.social.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE.name,
        applicationCategory: "EducationApplication",
        operatingSystem: "Web",
        description: SITE.description,
        url: SITE_URL,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Skip link (C2 a11y): first focusable element; jumps past the header
            nav to each page's <main id="main-content">. Hidden until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            nonce={nonce}
          >
            <SiteBackground />
            {children}
            <ScrollHelpers />
            <CookieConsent />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
