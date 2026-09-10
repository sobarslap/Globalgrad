import { SignInForm } from "@/components/auth/sign-in-form";

const googleEnabled =
  !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

export default function SignInPage() {
  return <SignInForm googleEnabled={googleEnabled} />;
}
