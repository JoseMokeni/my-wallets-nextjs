"use client";
import { RegisterForm } from "@/components/register-form";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm error={error} />
      </div>
    </div>
  );
}
