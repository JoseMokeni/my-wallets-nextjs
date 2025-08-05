"use client";
import { RegisterForm } from "@/components/register-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return <RegisterForm error={error} />;
}

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterContent />
        </Suspense>
      </div>
    </div>
  );
}
