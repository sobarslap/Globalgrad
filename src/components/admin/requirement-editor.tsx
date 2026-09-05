"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProgramRequirements } from "@/lib/data/admin";
import { updateProgramRequirements } from "@/lib/actions/admin";
import { REQUIREMENT_FIELDS, requirementLabel } from "@/lib/engines/requirements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Row({ p }: { p: ProgramRequirements }) {
  const [vals, setVals] = useState({
    minCgpa: p.minCgpa,
    minIelts: p.minIelts,
    admitCgpa: p.admitCgpa,
    admitIelts: p.admitIelts,
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const dirty = REQUIREMENT_FIELDS.some((f) => vals[f] !== p[f]);

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await updateProgramRequirements(p.id, vals);
      if (res.ok) {
        setMsg("Saved — students tracking this program were notified.");
        router.refresh();
      } else {
        setMsg(res.error ?? "Failed.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="mb-3">
        <p className="text-sm font-medium">{p.programName}</p>
        <p className="text-xs text-muted-foreground">{p.university}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {REQUIREMENT_FIELDS.map((f) => (
          <label key={f} className="space-y-1 text-xs text-muted-foreground">
            {requirementLabel(f)}
            <Input
              type="number"
              step="0.1"
              value={vals[f]}
              onChange={(e) =>
                setVals((v) => ({ ...v, [f]: e.target.valueAsNumber }))
              }
              className="h-8"
            />
          </label>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button size="sm" disabled={!dirty || pending} onClick={save}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}

export function RequirementEditor({ programs }: { programs: ProgramRequirements[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {programs.map((p) => (
        <Row key={p.id} p={p} />
      ))}
    </div>
  );
}
