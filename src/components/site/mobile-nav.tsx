"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export interface MobileNavItem {
  href: string;
  label: string;
}

/**
 * Hamburger menu for small screens (the desktop nav is hidden below `lg`).
 * `children` renders the auth actions (sign in / out) at the bottom of the panel.
 */
export function MobileNav({
  items,
  children,
}: {
  items: MobileNavItem[];
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-30 cursor-default bg-black/20"
          />
          <div className="fixed inset-x-0 top-16 z-40 border-b border-border/40 bg-background/95 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
              {items.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-accent"
                >
                  {l.label}
                </Link>
              ))}
              {children && (
                <div
                  className="mt-2 flex flex-col gap-2 border-t border-border/40 px-3 pt-3"
                  onClick={() => setOpen(false)}
                >
                  {children}
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
