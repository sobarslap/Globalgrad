"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import type { ContentItem, ContentOverview } from "@/lib/data/admin";
import { setContentPublished } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

type Kind = "university" | "program" | "scholarship";

function Section({
  title,
  kind,
  items,
  onToggle,
  pending,
}: {
  title: string;
  kind: Kind;
  items: ContentItem[];
  onToggle: (kind: Kind, id: string, published: boolean) => void;
  pending: boolean;
}) {
  const hidden = items.filter((i) => !i.published).length;
  return (
    <section>
      <h2 className="mb-3 font-semibold">
        {title}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          ({items.length} · {hidden} unpublished)
        </span>
      </h2>
      <div className="divide-y divide-border/50 rounded-2xl border border-border/60">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between gap-3 p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{i.label}</p>
              <p className="truncate text-xs text-muted-foreground">{i.sub}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${i.published ? "text-emerald-500" : "text-amber-500"}`}
              >
                {i.published ? "Published" : "Unpublished"}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => onToggle(kind, i.id, !i.published)}
              >
                {i.published ? (
                  <>
                    <EyeOff className="mr-1 h-3.5 w-3.5" /> Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="mr-1 h-3.5 w-3.5" /> Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContentReview({ overview }: { overview: ContentOverview }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const toggle = (kind: Kind, id: string, published: boolean) =>
    start(async () => {
      const res = await setContentPublished(kind, id, published);
      if (!res.ok) setErr(res.error ?? "Failed.");
      else setErr(null);
      router.refresh();
    });

  return (
    <div className="space-y-8">
      {err && <p className="text-sm text-destructive">{err}</p>}
      <Section
        title="Universities"
        kind="university"
        items={overview.universities}
        onToggle={toggle}
        pending={pending}
      />
      <Section
        title="Programs"
        kind="program"
        items={overview.programs}
        onToggle={toggle}
        pending={pending}
      />
      <Section
        title="Scholarships"
        kind="scholarship"
        items={overview.scholarships}
        onToggle={toggle}
        pending={pending}
      />
    </div>
  );
}
