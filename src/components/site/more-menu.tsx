"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { MobileNavItem } from "@/components/site/mobile-nav";

/** Desktop "More ▾" dropdown for secondary nav links (keeps the top bar tidy). */
export function MoreMenu({ items }: { items: MobileNavItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        More <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border/60 bg-background p-1 shadow-lg">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-accent"
              >
                {i.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
