"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import {
  signInAsDemo,
  signInWithCredentials,
  signInWithGoogle,
  type AuthActionState,
} from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

const initial: AuthActionState = {};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C17.1 3.2 14.8 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 12s4.1 9.8 9.2 9.8c5.3 0 8.8-3.7 8.8-9 0-.6-.06-1-.15-1.6H12z"
      />
    </svg>
  );
}

export function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, action, pending] = useActionState(
    signInWithCredentials,
    initial
  );
  const [demoPending, startDemo] = useTransition();
  const [demoError, setDemoError] = useState<string | null>(null);

  const runDemo = () =>
    startDemo(async () => {
      setDemoError(null);
      const res = await signInAsDemo();
      // Success redirects (throws); a returned value means it failed.
      if (res?.error) setDemoError(res.error);
    });

  return (
    <div className="relative w-full max-w-md">
      {/* dotted backdrop */}
      <div className="pointer-events-none absolute -inset-6 -z-10 opacity-60 [background-image:radial-gradient(hsl(var(--muted-foreground)/0.4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="rounded-2xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to GlobalGrad
          </p>
        </div>

        {googleEnabled && (
          <>
            <form action={signInWithGoogle} className="mt-8">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-background/60 text-sm font-medium transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <GoogleIcon />
                Sign in with Google
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form action={action} className={googleEnabled ? "space-y-4" : "mt-8 space-y-4"}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>

          {state.twoFactor && (
            <div className="space-y-1.5">
              <Label htmlFor="token">Authentication code</Label>
              <Input
                id="token"
                name="token"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="6-digit code"
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the code from your authenticator app.
              </p>
            </div>
          )}

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
          >
            {pending
              ? "Signing in…"
              : state.twoFactor
                ? "Verify & sign in"
                : "Sign in"}
            {!pending && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={runDemo}
          disabled={demoPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-background/60 text-sm font-medium transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          {demoPending ? "Signing in…" : "Try the demo account"}
        </button>
        {demoError ? (
          <p className="mt-2 text-center text-xs text-destructive" role="alert">
            {demoError}
          </p>
        ) : (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Explore the full product instantly — no signup needed.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <p className="mt-6 px-4 text-center text-xs leading-relaxed text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
