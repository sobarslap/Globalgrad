import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "safe" | "target" | "reach" | "primary" | "success" | "warning";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border/60 bg-muted/50 text-muted-foreground",
  safe: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  target: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  reach: "border-rose-500/40 bg-rose-500/10 text-rose-500",
  primary: "border-primary/40 bg-primary/10 text-primary",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-500",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
