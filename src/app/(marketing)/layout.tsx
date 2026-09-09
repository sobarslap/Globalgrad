import type { ReactNode } from "react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

/**
 * Shell for public, non-app pages (about, privacy, terms). Uses the marketing
 * Navbar + Footer — not the authenticated app sidebar — so these stay reachable
 * and consistent for logged-out visitors and crawlers.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
