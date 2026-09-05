"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * HeaderShell — client wrapper that reproduces the key behavior of the Efferd
 * "Header 3" on 21st.dev: transparent at the top of the page, then a blurred,
 * bordered, shadowed bar once the user scrolls. Wraps the server-rendered nav
 * so auth/i18n stay on the server.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      {children}
    </header>
  );
}
