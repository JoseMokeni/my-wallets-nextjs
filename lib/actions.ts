"use server";

import { signIn } from "@/auth";
import { PrismaClient } from "./generated/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function signInWithGithub() {
  await signIn("github", {
    redirectTo: "/",
  });
}

export async function signInWithGoogle() {
  await signIn("google");
}

export async function signInWithApple() {
  await signIn("apple");
}

export async function signInWithCredentials(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          redirect("/login?error=InvalidCredentials");
        default:
          redirect("/login?error=AuthError");
      }
    }
    throw error;
  }
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

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 12);

  // create the user using prisma
  const prisma = new PrismaClient();
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) {
    throw new Error("User registration failed");
  }

  console.log(`User registered: ${user}`);

  // After successful registration, sign them in
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}
