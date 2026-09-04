"use client";

import { useState, useTransition } from "react";
import { Sparkles, ExternalLink, BookOpen } from "lucide-react";
import {
  summarizeInsights,
  type InsightResult,
} from "@/lib/actions/insights";
import { Button } from "@/components/ui/button";

export function InsightExplorer({ countries }: { countries: string[] }) {
  const [country, setCountry] = useState(countries[0] ?? "");
  const [result, setResult] = useState<InsightResult | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (c: string) => {
    setError(null);
    setResult(null);
    start(async () => {
      const res = await summarizeInsights(c);
      if (!res.ok) setError(res.error ?? "Could not load insights.");
      else setResult(res);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <select
            id="country"
            className="flex h-10 w-56 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => run(country)} disabled={pending || !country}>
          {pending ? "Summarizing…" : "Get insights"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {pending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse text-primary" />
          Reading sources and summarizing…
        </div>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Synthesis for{" "}
              {country}
            </h2>
            {result.summary ? (
              <div className="whitespace-pre-wrap rounded-2xl border border-border/60 bg-card/40 p-5 text-sm leading-relaxed">
                {result.summary}
              </div>
            ) : (
              <p className="rounded-2xl border border-border/60 p-5 text-sm text-muted-foreground">
                AI synthesis is unavailable right now — read the sources
                directly on the right.
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <BookOpen className="h-4 w-4 text-primary" /> Sources
            </h2>
            <ol className="space-y-3">
              {result.sources.map((s, i) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-border/60 p-3 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-xs text-primary">
                      [{i + 1}]
                    </span>
                    <div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                      >
                        {s.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {s.sourceType} · {s.topic}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Summaries are AI-synthesized from a curated, human-reviewed set of public
        sources — always verify specifics with the linked originals.
      </p>
    </div>
  );
}
