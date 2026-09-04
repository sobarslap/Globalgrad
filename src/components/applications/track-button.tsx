"use client";

import { useState, useTransition } from "react";
import { Plus, Check } from "lucide-react";
import { addApplication } from "@/lib/actions/applications";

/** Adds a program to the user's tracked applications. Reused across matches + search. */
export function TrackButton({ programId }: { programId: string }) {
  const [pending, start] = useTransition();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      disabled={pending || added}
      onClick={() =>
        start(async () => {
          const res = await addApplication(programId);
          if (res.ok) setAdded(true);
        })
      }
      className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/50 disabled:opacity-60"
    >
      {added ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" /> Tracking
        </>
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" /> {pending ? "Adding…" : "Track"}
        </>
      )}
    </button>
  );
}
