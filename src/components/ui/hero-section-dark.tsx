"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * HeroSection — rebuilt from the Farm UI "Hero Section Dark" (kinfe123) on
 * 21st.dev: an angled perspective grid backdrop, a top pill badge, a heading
 * whose tail is a gradient, a description, a CTA, and an optional product
 * screenshot framed with a top glow. Kept themeable via project tokens.
 */
interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: { regular: string; gradient: string };
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  gridOptions?: {
    angle?: number;
    cellSize?: number;
    opacity?: number;
    lightLineColor?: string;
    darkLineColor?: string;
  };
  children?: React.ReactNode;
}

const RetroGrid = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "gray",
  darkLineColor = "gray",
}: NonNullable<HeroSectionProps["gridOptions"]>) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties;

  return (
    <div
      className="pointer-events-none absolute size-full overflow-hidden [perspective:200px] opacity-[var(--opacity)]"
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent to-90%" />
    </div>
  );
};

export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      className,
      title = "Build products for everyone",
      subtitle = {
        regular: "Designing your projects faster with ",
        gradient: "the largest figma UI kit.",
      },
      description = "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium.",
      ctaText = "Browse courses",
      ctaHref = "#",
      secondaryCtaText,
      secondaryCtaHref = "#",
      gridOptions,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section ref={ref} className={cn("relative", className)} {...props}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] w-full bg-[radial-gradient(ellipse_50%_60%_at_50%_-10%,hsl(var(--primary)/0.22),transparent)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-8">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              {title}
              <ChevronRight className="h-3 w-3" />
            </span>
            <h1 className="mx-auto text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              {subtitle.regular}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {subtitle.gradient}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground md:text-lg">
              {description}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={ctaHref}
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-b from-primary to-primary/80 px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {ctaText}
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {secondaryCtaText && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 px-8 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </div>
          {children && (
            <div className="relative mx-auto mt-16 max-w-5xl">
              <div className="absolute -inset-x-20 -top-10 h-40 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.35),transparent_70%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-2xl backdrop-blur">
                {children}
              </div>
            </div>
          )}
        </div>
        <RetroGrid {...(gridOptions ?? {})} />
      </section>
    );
  }
);
HeroSection.displayName = "HeroSection";
