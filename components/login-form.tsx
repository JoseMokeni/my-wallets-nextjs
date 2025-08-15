"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithApple,
  signInWithCredentials,
} from "@/lib/actions";
import ContinueWith from "./continue-with";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LoginForm({
  className,
  error,
  ...props
}: React.ComponentProps<"div"> & { error?: string | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "InvalidCredentials":
        return "Invalid email or password. Please try again.";
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and password.";
      case "EmailAlreadyExists":
        return "An account with this email already exists. Please use a different email or try logging in.";
      case "AuthError":
        return "Invalid credentials. Please check your email and password.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with an account using a different sign-in method. Please use your original sign-in method or contact support.";
      case "Signin":
        return "This email is already associated with an account using a different sign-in method. Please use your original sign-in method.";
      case "AccessDenied":
        return "This email is already associated with an account using a different sign-in method. Please use your original sign-in method or contact support.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>
            )}
            <form
              action={signInWithCredentials}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your My Wallets account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-6">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <ContinueWith />
            <div className="text-center text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/wallets-auth.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
