"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * ShinyButton — a pill button with a repeating light sweep, rebuilt from the
 * designali "Shiny Button" on 21st.dev to use this project's tokens (themeable
 * in light and dark). Renders a Next.js Link when `href` is provided, otherwise
 * a <button>. The sweep is CSS-only (see `.shiny-sheen` in globals.css).
 */
const base = cn(
  "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-wide",
  "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
  "transition-shadow hover:shadow-primary/40 active:scale-[0.98]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

function Sheen() {
  return (
    <span className="shiny-sheen pointer-events-none absolute inset-0 rounded-full" />
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};
type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function ShinyButton({
  children,
  className,
  href,
  ...props
}: ButtonProps | LinkProps) {
  if (typeof href === "string") {
    return (
      <Link
        href={href}
        className={cn(base, className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <span className="relative z-10">{children}</span>
        <Sheen />
      </Link>
    );
  }
  return (
    <button
      className={cn(base, className)}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span className="relative z-10">{children}</span>
      <Sheen />
    </button>
  );
}
