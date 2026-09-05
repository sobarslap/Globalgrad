import { redirect } from "next/navigation";
import { CalendarDays, Flag, CircleDot } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyCalendarItems } from "@/lib/data/calendar";
import { groupByMonth, daysUntil } from "@/lib/engines/calendar";
import { AppHeader } from "@/components/site/app-header";

export const metadata = { title: "Calendar — GlobalGrad" };

function daysLabel(n: number): { text: string; className: string } {
  if (n < 0) return { text: `${Math.abs(n)}d ago`, className: "text-muted-foreground" };
  if (n === 0) return { text: "today", className: "text-rose-500 font-medium" };
  if (n <= 7) return { text: `${n}d left`, className: "text-rose-500" };
  if (n <= 30) return { text: `${n}d left`, className: "text-amber-500" };
  return { text: `${n}d left`, className: "text-muted-foreground" };
}

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const items = await getMyCalendarItems();
  const groups = groupByMonth(items);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
          <p className="mt-1 text-muted-foreground">
            Deadlines and application milestones across everything you&rsquo;re
            tracking, in one timeline.
          </p>
        </div>

        {groups.length === 0 ? (
          <p className="rounded-xl border border-border/60 bg-muted/40 px-6 py-16 text-center text-muted-foreground">
            Nothing scheduled yet — track a program on the{" "}
            <a href="/applications" className="text-primary hover:underline">
              Applications
            </a>{" "}
            page to populate your calendar.
          </p>
        ) : (
          <div className="space-y-8">
            {groups.map((g) => (
              <section key={g.key}>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> {g.label}
                </h2>
                <ol className="space-y-2 border-l border-border/60 pl-4">
                  {g.items.map((item) => {
                    const dl = item.kind === "deadline";
                    const d = daysLabel(daysUntil(item.date));
                    return (
                      <li key={item.id} className="relative">
                        <span className="absolute -left-[21px] top-1 text-muted-foreground">
                          {dl ? (
                            <Flag className="h-3.5 w-3.5" />
                          ) : (
                            <CircleDot className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <div className="flex items-baseline justify-between gap-3 rounded-lg border border-border/50 bg-background px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.title}
                            </p>
                            {item.meta && (
                              <p className="truncate text-xs text-muted-foreground">
                                {item.meta}
                              </p>
                            )}
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs text-muted-foreground">
                              {item.date.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            {dl && <p className={`text-xs ${d.className}`}>{d.text}</p>}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
