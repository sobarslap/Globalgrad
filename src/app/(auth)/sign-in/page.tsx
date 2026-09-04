"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInWithCredentials,
  type AuthActionState,
} from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthActionState = {};

export default function SignInPage() {
  const [state, action, pending] = useActionState(
    signInWithCredentials,
    initial
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <Link href="/sign-up" className="text-primary hover:underline">
            Create account
          </Link>
          <Link href="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Just signed up?{" "}
          <Link href="/verify-email" className="hover:underline">
            Verify your email
          </Link>{" "}
          first.
        </p>
      </CardContent>
    </Card>
  );
}
