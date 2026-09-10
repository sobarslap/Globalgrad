"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import {
  sendContactMessage,
  type ContactState,
} from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ContactState = {};

const topics = [
  "General question",
  "Feedback on the product",
  "Partnership / institution",
  "Bug or something broken",
  "Press / academic",
];

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Message sent</h3>
        <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {/* Honeypot — visually hidden, off the tab order, ignored by real users. */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="topic">What&apos;s it about?</Label>
        <select
          id="topic"
          name="topic"
          defaultValue={topics[0]}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="What can I help with?"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          "Sending…"
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
