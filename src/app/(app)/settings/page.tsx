import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeleteAccount } from "@/components/account/delete-account";
import { TwoFactorSettings } from "@/components/account/two-factor-settings";
import { BillingSettings } from "@/components/account/billing-settings";
import { getUserBilling } from "@/lib/data/billing";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata = { title: "Settings" };

const roleLabel = (r: string) =>
  r
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const { checkout } = await searchParams;

  const [account, billing] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true },
    }),
    getUserBilling(session.user.id),
  ]);

  return (
    <div className="min-h-screen">
      <main id="main-content" className="mx-auto max-w-2xl space-y-8 px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

        <section className="rounded-2xl border border-border/60 p-5">
          <h2 className="mb-3 font-semibold">Account</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{session.user.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{session.user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Role</dt>
              <dd>{roleLabel(session.user.role)}</dd>
            </div>
          </dl>
        </section>

        <BillingSettings
          billing={billing}
          configured={isStripeConfigured}
          justSubscribed={checkout === "success"}
        />

        <TwoFactorSettings enabled={account?.twoFactorEnabled ?? false} />

        <DeleteAccount />
      </main>
    </div>
  );
}
