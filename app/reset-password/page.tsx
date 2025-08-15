import { ResetPasswordForm } from "@/components/reset-password-form";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6">
      <ResetPasswordForm token={token} />
    </div>
  );
}
