import Link from "next/link";
import { verifyEmailToken } from "@/lib/actions/verify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResendVerification } from "./resend-verification";

export const metadata = { title: "Verify email — GlobalGrad" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (token) {
    const res = await verifyEmailToken(token);
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{res.ok ? "Email verified" : "Verification failed"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {res.ok ? (
            <p className="text-sm text-emerald-500">
              Your email is verified. You can now sign in.
            </p>
          ) : (
            <p className="text-sm text-destructive">{res.error}</p>
          )}
          <Button asChild className="w-full">
            <Link href="/sign-in">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your email. Didn&apos;t get it? Enter
          your email to resend.
        </p>
        <ResendVerification />
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/sign-in" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
