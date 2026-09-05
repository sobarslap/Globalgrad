import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlobalGrad — Study Abroad & Scholarship Decision Support",
  description:
    "Personalized study-abroad decisions: readiness scoring, smart university matching, scholarship eligibility, funding analysis, visa prep, and an AI advisor grounded in real data.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The middleware sets a per-request nonce (B1); pass it to next-themes so its
  // pre-hydration inline script carries the nonce and isn't blocked by the CSP.
  // Reading headers() also opts the whole tree into dynamic rendering, which
  // nonce-based CSP requires.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip link (C2 a11y): first focusable element; jumps past the header
            nav to each page's <main id="main-content">. Hidden until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
