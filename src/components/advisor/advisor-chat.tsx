"use client";

import { useRef, useState, useTransition } from "react";
import { Sparkles, Send, User } from "lucide-react";
import { askAdvisor } from "@/lib/actions/advisor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { role: "user" | "advisor"; text: string };

const SUGGESTIONS = [
  "Why is my top match a good fit?",
  "How can I improve my chances at reach schools?",
  "Compare my best country options for cost and work.",
  "Which scholarships should I prioritize and why?",
];

export function AdvisorChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || pending) return;
    setError(null);
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    start(async () => {
      const res = await askAdvisor(q);
      if (res.ok && res.text) {
        setMessages((m) => [...m, { role: "advisor", text: res.text! }]);
      } else {
        setError(res.error ?? "Something went wrong.");
      }
      requestAnimationFrame(() =>
        endRef.current?.scrollIntoView({ behavior: "smooth" })
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="rounded-2xl border border-border/60 p-5">
          <p className="mb-3 text-sm text-muted-foreground">
            Ask anything about your matches, funding, countries or next steps.
            The advisor reasons over <em>your</em> profile and platform data.
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-border/60 px-3 py-1.5 text-xs transition-colors hover:border-primary/50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                m.role === "advisor"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.role === "advisor" ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </span>
            <div className="whitespace-pre-wrap rounded-2xl border border-border/60 bg-card/40 p-4 text-sm leading-relaxed">
              {m.text}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the advisor…"
          disabled={pending}
        />
        <Button type="submit" size="icon" disabled={pending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        AI guidance can be imperfect — it explains the engine's results but
        doesn&apos;t replace them. Verify specifics with official sources.
      </p>
    </div>
  );
}
