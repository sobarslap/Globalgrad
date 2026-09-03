import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          GlobalGrad
        </Link>
        <p className="text-sm text-muted-foreground">
          A personalized decision-support platform for study abroad &amp;
          scholarship planning.
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} GlobalGrad
        </p>
      </div>
    </footer>
  );
}
