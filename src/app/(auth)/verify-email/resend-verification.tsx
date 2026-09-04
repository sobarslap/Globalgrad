"use client";

import { useActionState } from "react";
import { resendVerification, type VerifyState } from "@/lib/actions/verify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: VerifyState = {};

export function ResendVerification() {
  const [state, action, pending] = useActionState(resendVerification, initial);

  if (state.message) {
    return <p className="text-sm text-muted-foreground">{state.message}</p>;
  }
  return (
    <form action={action} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Resend verification link"}
      </Button>
    </form>
  );
}
