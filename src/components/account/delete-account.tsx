"use client";

import { useActionState } from "react";
import { deleteMyAccount, type DeleteState } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: DeleteState = {};

export function DeleteAccount() {
  const [state, action, pending] = useActionState(deleteMyAccount, initial);

  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
      <h2 className="font-semibold text-destructive">Delete account</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This permanently removes your account, profile, applications and all
        personal data. This cannot be undone.
      </p>
      <form action={action} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="confirm">
            Type <span className="font-mono">DELETE</span> to confirm
          </Label>
          <Input
            id="confirm"
            name="confirm"
            autoComplete="off"
            className="sm:w-56"
            placeholder="DELETE"
          />
        </div>
        <Button
          type="submit"
          variant="destructive"
          disabled={pending}
          className="sm:w-auto"
        >
          {pending ? "Deleting…" : "Delete my account"}
        </Button>
      </form>
      {state.error && (
        <p className="mt-2 text-sm text-destructive">{state.error}</p>
      )}
    </div>
  );
}
