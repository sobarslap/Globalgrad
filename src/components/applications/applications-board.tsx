"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Printer,
  Trash2,
  Wand2,
} from "lucide-react";
import type { ApplicationStatus, DocStatus } from "@prisma/client";
import type { ApplicationView } from "@/lib/data/applications";
import {
  buildBalancedPlan,
  updateApplicationStatus,
  setChecklistItemStatus,
  removeApplication,
} from "@/lib/actions/applications";
import { Button } from "@/components/ui/button";

const STATUSES: ApplicationStatus[] = [
  "PLANNED",
  "PREPARING",
  "APPLIED",
  "INTERVIEW",
  "OFFER_RECEIVED",
  "REJECTED",
  "VISA_PROCESSING",
  "ENROLLED",
];
const statusLabel = (s: string) =>
  s
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const DOC_CYCLE: DocStatus[] = ["PENDING", "PREPARED", "SUBMITTED"];
const docColor: Record<DocStatus, string> = {
  PENDING: "text-muted-foreground",
  PREPARED: "text-amber-500",
  SUBMITTED: "text-emerald-500",
};

const selectCls =
  "h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ApplicationsBoard({
  applications,
  hasProfile,
}: {
  applications: ApplicationView[];
  hasProfile: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setNote(res.error ?? "Something went wrong.");
      else setNote(null);
      router.refresh();
    });

  // Deadline monitor: nearest deadlines across all tracked applications.
  const upcoming = applications
    .flatMap((a) =>
      a.deadlines.map((d) => ({ ...d, university: a.program.university }))
    )
    .filter((d) => d.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Export */}
      <div className="flex justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="mr-1.5 h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      {/* Strategy Builder */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 print:hidden sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 font-semibold">
            <Wand2 className="h-4 w-4 text-primary" /> Application strategy
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Auto-build a balanced plan — 3 Safe, 4 Target, 2 Reach — from your
            profile and matches.
          </p>
        </div>
        {hasProfile ? (
          <Button onClick={() => run(buildBalancedPlan)} disabled={pending}>
            {pending ? "Building…" : "Build balanced plan"}
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/dashboard">Add your profile first</Link>
          </Button>
        )}
      </div>

      {/* Deadline monitor */}
      {upcoming.length > 0 && (
        <div className="rounded-2xl border border-border/60 p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <CalendarClock className="h-4 w-4" /> Upcoming deadlines
          </h2>
          <ul className="space-y-2">
            {upcoming.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{d.title}</span>
                <span
                  className={
                    d.daysLeft <= 14
                      ? "font-medium text-rose-500"
                      : d.daysLeft <= 30
                        ? "font-medium text-amber-500"
                        : "text-muted-foreground"
                  }
                >
                  {d.daysLeft} days left
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {note && <p className="text-sm text-destructive">{note}</p>}

      {/* Tracker */}
      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No applications yet. Build a plan above, or add programs from your{" "}
          <Link href="/dashboard" className="text-primary hover:underline">
            matches
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => {
            const soonest = a.deadlines.find((d) => d.daysLeft >= 0);
            const isOpen = expanded === a.id;
            return (
              <div
                key={a.id}
                className="rounded-2xl border border-border/60 bg-card/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {a.program.university}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {a.program.programName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {soonest && (
                      <span
                        className={`hidden text-xs sm:inline ${
                          soonest.daysLeft <= 30
                            ? "text-amber-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {soonest.daysLeft}d
                      </span>
                    )}
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {a.progress}% docs
                      </div>
                      <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${a.progress}%` }}
                        />
                      </div>
                    </div>

                    <select
                      className={selectCls}
                      value={a.status}
                      disabled={pending}
                      onChange={(e) =>
                        run(() =>
                          updateApplicationStatus(
                            a.id,
                            e.target.value as ApplicationStatus
                          )
                        )
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Toggle checklist"
                      className="print:hidden"
                      onClick={() => setExpanded(isOpen ? null : a.id)}
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove application"
                      className="print:hidden"
                      onClick={() => run(() => removeApplication(a.id))}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-border/60 p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Document checklist
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {a.checklist.map((item) => {
                        const next =
                          DOC_CYCLE[
                            (DOC_CYCLE.indexOf(item.status) + 1) %
                              DOC_CYCLE.length
                          ];
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                run(() =>
                                  setChecklistItemStatus(item.id, next)
                                )
                              }
                              className="flex w-full items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-left text-sm transition-colors hover:border-primary/40"
                            >
                              <span>{item.name}</span>
                              <span
                                className={`text-xs font-medium ${docColor[item.status]}`}
                              >
                                {statusLabel(item.status)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Tap a document to cycle Pending → Prepared → Submitted.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
