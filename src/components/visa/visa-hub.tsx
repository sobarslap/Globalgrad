"use client";

import { useState } from "react";
import {
  FileCheck,
  Wallet,
  Clock,
  DollarSign,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import type { VisaGuide } from "@/lib/data/visa";
import { Button } from "@/components/ui/button";

export function VisaHub({ guides }: { guides: VisaGuide[] }) {
  const [code, setCode] = useState(guides[0]?.code ?? "");
  const guide = guides.find((g) => g.code === code) ?? guides[0];
  if (!guide) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {guides.map((g) => (
          <Button
            key={g.code}
            size="sm"
            variant={g.code === code ? "default" : "outline"}
            onClick={() => setCode(g.code)}
          >
            <span className="mr-1.5">{g.flag}</span>
            {g.country}
          </Button>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 p-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{guide.flag}</span>
          <div>
            <h2 className="text-xl font-semibold">{guide.visaName}</h2>
            <p className="text-sm text-muted-foreground">{guide.country}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-medium">
              <FileCheck className="h-4 w-4 text-primary" /> Required documents
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {guide.requiredDocs.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-primary">•</span> {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-1 flex items-center gap-2 font-medium">
                <Wallet className="h-4 w-4 text-primary" /> Financial proof
              </h3>
              <p className="text-sm text-muted-foreground">
                {guide.financialProof}
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <h3 className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-primary" /> Timeline
                </h3>
                <p className="text-sm text-muted-foreground">
                  {guide.processingTimeline}
                </p>
              </div>
              <div>
                <h3 className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4 text-primary" /> Visa fee
                </h3>
                <p className="text-sm text-muted-foreground">
                  ~${guide.visaFeeUsd}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Common mistakes
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {guide.commonMistakes.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="text-amber-500">▸</span> {m}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={guide.embassyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Official guidance <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="text-xs text-muted-foreground">
        Reference information only — visa rules change often. Always confirm with
        the official embassy or consulate before applying.
      </p>
    </div>
  );
}
