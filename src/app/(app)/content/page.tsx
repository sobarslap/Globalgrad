import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getContentOverview } from "@/lib/data/admin";
import { AppHeader } from "@/components/site/app-header";
import { ContentReview } from "@/components/admin/content-review";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Content review — GlobalGrad" };

export default async function ContentPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "CONTENT_MANAGER" && session.user.role !== "ADMIN")
    redirect("/dashboard");

  const overview = await getContentOverview();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Content review
            </h1>
            <p className="mt-1 text-muted-foreground">
              Review and publish universities, programs and scholarships before
              they reach students. Unpublished items never appear in matching.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/content/requirements">Edit requirements</Link>
          </Button>
        </div>
        {overview && <ContentReview overview={overview} />}
      </main>
    </div>
  );
}
