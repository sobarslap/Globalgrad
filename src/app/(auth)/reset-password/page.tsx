import { ResetForm } from "./reset-form";

export const metadata = { title: "Reset password — GlobalGrad" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetForm token={token ?? ""} />;
}
