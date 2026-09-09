"use client";

import { useRef, useState, useTransition } from "react";
import { Sparkles, Send, User } from "lucide-react";
import { askAdvisor } from "@/lib/actions/advisor";
import { ADVISOR_MODES, type AdvisorMode } from "@/lib/advisor-modes";
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
  const [mode, setMode] = useState<AdvisorMode>("general");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () =>
    requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    );

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || pending) return;
    setError(null);
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    start(async () => {
      // Stream tokens from the C7 endpoint for a snappier feel; fall back to the
      // non-streaming server action if the stream can't be reached.
      try {
        const res = await fetch("/api/advisor/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, mode }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "The advisor is unavailable.");
        }

        // Open an empty advisor bubble, then append chunks as they arrive.
        setMessages((m) => [...m, { role: "advisor", text: "" }]);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const text = acc;
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = { role: "advisor", text };
            return next;
          });
          scrollToEnd();
        }

        // A stream that produced only an inline error → drop the empty bubble.
        if (!acc.trim() || acc.trimStart().startsWith("[error]")) {
          setMessages((m) => m.slice(0, -1));
          setError(acc.replace(/^\s*\[error\]\s*/, "") || "Something went wrong.");
        }
      } catch {
        const res = await askAdvisor(q, mode);
        if (res.ok && res.text) {
          setMessages((m) => [...m, { role: "advisor", text: res.text! }]);
        } else {
          setError(res.error ?? "Something went wrong.");
        }
      }
      scrollToEnd();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Focus modes */}
      <div className="flex flex-wrap gap-2">
        {ADVISOR_MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === m.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40"
            }`}
          >
            <span className="mr-1">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

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
        {pending && messages[messages.length - 1]?.role !== "advisor" && (
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
        <Button
          type="submit"
          size="icon"
          disabled={pending || !input.trim()}
          aria-label="Send question to the advisor"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        AI guidance can be imperfect — it explains the engine&apos;s results but
        doesn&apos;t replace them. Verify specifics with official sources.
      </p>
    </div>
  );
}
