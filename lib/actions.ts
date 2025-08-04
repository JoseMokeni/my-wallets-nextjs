"use server";

import { signIn } from "@/auth";

export async function signInWithGithub() {
  await signIn("github");
}

export async function signInWithGoogle() {
  await signIn("google");
}

export async function signInWithApple() {
  await signIn("apple");
}

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}

export async function registerWithCredentials(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  // Add password validation
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Here you would typically create the user account
  // For now, we'll just redirect to sign in after registration
  // You'll need to implement your user registration logic here

  // After successful registration, sign them in
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}
