"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── the corridor ────────────────────────────────────────────────
 * Two rails of cards ride from far behind the screen toward the
 * viewer. Perspective alone does the work that looks like two
 * animations: as a card's z grows it gets bigger *and* its screen x
 * sweeps outward from the vanishing point, because the projection
 * scales position and size by the same factor.
 * ─────────────────────────────────────────────────────────────── */

export type CorridorPath = {
  /** Strength of the projection. Lower is a wider-angle, more dramatic rush. @default 30 */
  perspective?: number;
  /** Card width in world units. @default 18 */
  cardWidth?: number;
  /** Card height in world units. @default 25 */
  cardHeight?: number;
  /** Corner radius applied to each card. @default 0.4 */
  cardRadius?: number;
  /** On-screen card height at the waist, where a card is born. @default 2.6 */
  birthHeight?: number;
  /** On-screen card height as a card leaves the frame. @default 46 */
  exitHeight?: number;
  /** Lateral offset at birth. Negative starts the card across the axis. @default -11 */
  railBirth?: number;
  /** Lateral offset once the rails have finished opening. @default 44 */
  railExit?: number;
  /** How front-loaded the opening is. >1 opens early then holds. @default 3.3 */
  fan?: number;
  /** Y-rotation at birth, degrees. @default 6 */
  turnBirth?: number;
  /** Y-rotation at exit, degrees. @default 28 */
  turnExit?: number;
  /** Keyframe stops used to trace the curve. Raise only if motion looks faceted. @default 24 */
  stops?: number;
};

const PATH: Required<CorridorPath> = {
  perspective: 30,
  cardWidth: 18,
  cardHeight: 25,
  cardRadius: 0.4,
  birthHeight: 2.6,
  exitHeight: 46,
  railBirth: -11,
  railExit: 44,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 28,
  stops: 24,
};

/** Sample the path once so the CSS keyframes trace the real curve. */
function keyframes(dir: 1 | -1, name: string, p: Required<CorridorPath>) {
  const steps: string[] = [];
  for (let s = 0; s <= p.stops; s++) {
    const u = s / p.stops;
    const scale =
      (p.birthHeight / p.cardHeight) *
      Math.pow(p.exitHeight / p.birthHeight, u);
    const z = p.perspective * (1 - 1 / scale);
    const rail =
      p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
    steps.push(
      `${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(
        2,
      )}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`,
    );
  }
  return `@keyframes ${name}{${steps.join("")}}`;
}

export type StreamImage = {
  src: string;
  /** Only used if you drop the decorative treatment; the corridor is aria-hidden. */
  alt?: string;
};

export type ImageStreamHeroProps = {
  images: StreamImage[];
  /** Cards on each rail at once. @default 9 */
  cards?: number;
  /** Seconds for one card to travel the whole corridor. @default 18 */
  speed?: number;
  /** Vertical placement of the corridor's axis, as a percentage of height. @default 55 */
  axis?: number;
  /** Override any part of the corridor geometry. Merged over the defaults. */
  path?: CorridorPath;
  /** Content rendered above the corridor. */
  children?: React.ReactNode;
  className?: string;
};

export function ImageStreamHero({
  images,
  cards = 9,
  speed = 18,
  axis = 55,
  path,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & ImageStreamHeroProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const right = `ish-r-${id}`;
  const left = `ish-l-${id}`;
  const card = `ish-c-${id}`;

  const p = React.useMemo(() => ({ ...PATH, ...path }), [path]);

  const css = React.useMemo(
    () =>
      `${keyframes(1, right, p)}${keyframes(-1, left, p)}` +
      `@media(prefers-reduced-motion:reduce){.${card}{animation-play-state:paused}}`,
    [right, left, card, p],
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...props}
      style={{ containerType: "inline-size", ...props.style }}
    >
      <style>{css}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          perspective: `${p.perspective}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[right, left].map((name) =>
            Array.from({ length: cards }, (_, i) => {
              const img = images[i % Math.max(images.length, 1)];
              return (
                <div
                  key={`${name}-${i}`}
                  className={cn(card, "absolute overflow-hidden")}
                  style={{
                    left: "50%",
                    top: `${axis}%`,
                    width: `${p.cardWidth}cqw`,
                    height: `${p.cardHeight}cqw`,
                    marginLeft: `${-p.cardWidth / 2}cqw`,
                    marginTop: `${-p.cardHeight / 2}cqw`,
                    borderRadius: `${p.cardRadius}cqw`,
                    animation: `${name} ${speed}s linear infinite`,
                    animationDelay: `${-(i * speed) / cards}s`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element -- decorative corridor of many remote images; next/image adds no value here
                    <img
                      src={img.src}
                      alt={img.alt ?? ""}
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : null}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export default ImageStreamHero;
