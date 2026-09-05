"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import {
  startTwoFactorSetup,
  confirmTwoFactor,
  disableTwoFactor,
} from "@/lib/actions/twofactor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TwoFactorSettings({ enabled }: { enabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // setup state
  const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // disable state
  const [disabling, setDisabling] = useState(false);
  const [pw, setPw] = useState("");
  const [disableCode, setDisableCode] = useState("");

  function begin() {
    setMsg(null);
    startTransition(async () => {
      const res = await startTwoFactorSetup();
      if (res.ok && res.secret && res.uri) setSetup({ secret: res.secret, uri: res.uri });
      else setMsg(res.error ?? "Could not start setup.");
    });
  }

  function confirm() {
    setMsg(null);
    startTransition(async () => {
      const res = await confirmTwoFactor(code);
      if (res.ok) {
        setSetup(null);
        setCode("");
        router.refresh();
      } else setMsg(res.error ?? "Could not enable.");
    });
  }

  function disable() {
    setMsg(null);
    startTransition(async () => {
      const res = await disableTwoFactor(pw, disableCode);
      if (res.ok) {
        setDisabling(false);
        setPw("");
        setDisableCode("");
        router.refresh();
      } else setMsg(res.error ?? "Could not disable.");
    });
  }

  return (
    <section className="rounded-2xl border border-border/60 p-5">
      <h2 className="mb-1 flex items-center gap-2 font-semibold">
        {enabled ? (
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
        ) : (
          <ShieldAlert className="h-4 w-4 text-amber-500" />
        )}
        Two-factor authentication
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {enabled
          ? "2FA is on. You'll enter a code from your authenticator app when signing in."
          : "Add a second step at sign-in using an authenticator app (TOTP)."}
      </p>

      {/* Not enabled, no setup in progress */}
      {!enabled && !setup && (
        <Button size="sm" onClick={begin} disabled={pending}>
          {pending ? "Please wait…" : "Enable 2FA"}
        </Button>
      )}

      {/* Setup in progress */}
      {!enabled && setup && (
        <div className="space-y-3">
          <p className="text-sm">
            Add this secret to your authenticator app, then enter the current
            code to confirm:
          </p>
          <code className="block break-all rounded-md bg-muted px-3 py-2 text-sm">
            {setup.secret}
          </code>
          <p className="break-all text-xs text-muted-foreground">{setup.uri}</p>
          <div className="space-y-1.5">
            <Label htmlFor="tf-code">6-digit code</Label>
            <Input
              id="tf-code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="max-w-40"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={confirm} disabled={pending || code.length < 6}>
              Confirm & enable
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSetup(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Enabled */}
      {enabled && !disabling && (
        <Button size="sm" variant="outline" onClick={() => setDisabling(true)}>
          Disable 2FA
        </Button>
      )}
      {enabled && disabling && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Confirm your password and a current code to turn 2FA off.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="tf-pw">Password</Label>
            <Input
              id="tf-pw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tf-dc">6-digit code</Label>
            <Input
              id="tf-dc"
              inputMode="numeric"
              maxLength={6}
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              className="max-w-40"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={disable}
              disabled={pending || !pw || disableCode.length < 6}
            >
              Disable
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDisabling(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
    </section>
  );
}
