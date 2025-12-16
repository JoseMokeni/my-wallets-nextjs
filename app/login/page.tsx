"use client";
import { LoginForm } from "@/components/login-form";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AuthPageLoading } from "@/components/ui/page-loading";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  const error = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return <LoginForm error={error} />;
}

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<AuthPageLoading />}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
