"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Site-wide scroll affordances: a thin reading-progress bar pinned to the top of
 * the viewport, and a back-to-top button that fades in after the user scrolls
 * past a threshold. Purely presentational; respects reduced-motion via CSS.
 */
export function ScrollHelpers() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
        setProgress(pct);
        setShowTop(doc.scrollTop > 600);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary transition-transform duration-75"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/80 text-foreground shadow-lg backdrop-blur transition-all hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" aria-hidden />
      </button>
    </>
  );
}
