import { FloatingPaths } from "@/components/ui/background-paths";

/**
 * Site-wide animated backdrop: the FloatingPaths ribbons, tinted to the brand
 * primary and held at a very low opacity so they read as texture behind every
 * page without hurting contrast. Fixed and non-interactive; sits behind all
 * content (body is a flex column with its own background, so this shows through
 * transparent section backgrounds).
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-primary opacity-[0.09] dark:opacity-[0.12]"
    >
      {/* Static (non-animated) so the whole-site backdrop costs nothing at
          runtime — the animated variant ran 72 infinite path tweens on every
          page and starved the main thread. */}
      <FloatingPaths position={1} count={16} animate={false} />
      <FloatingPaths position={-1} count={16} animate={false} />
    </div>
  );
}
