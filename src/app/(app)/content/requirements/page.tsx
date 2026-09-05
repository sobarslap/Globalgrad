import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getProgramsForRequirements } from "@/lib/data/admin";
import { AppHeader } from "@/components/site/app-header";
import { RequirementEditor } from "@/components/admin/requirement-editor";

export const metadata = { title: "Program requirements — GlobalGrad" };

export default async function RequirementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (session.user.role !== "CONTENT_MANAGER" && session.user.role !== "ADMIN")
    redirect("/dashboard");

  const programs = await getProgramsForRequirements();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <div>
          <Link
            href="/content"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to content review
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Program requirements
          </h1>
          <p className="mt-1 text-muted-foreground">
            Edit admission requirements. Any change is recorded and every student
            tracking that program is notified automatically (Requirement Monitor).
          </p>
        </div>
        <RequirementEditor programs={programs} />
      </main>
    </div>
  );
}
