"use server";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function signInWithGithub() {
  await signIn("github", {
    redirectTo: "/dashboard",
  });
}

export async function signInWithGoogle() {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}

export async function signInWithApple() {
  await signIn("apple");
}

export async function signInWithCredentials(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
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

export async function signOutUser() {
  await signOut({ redirectTo: "/login" });
}

export async function registerWithCredentials(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  // Add password validation
  if (password !== confirmPassword) {
    redirect("/register?error=PasswordMismatch");
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // create the user using prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      redirect("/register?error=RegistrationFailed");
    }
  } catch (error: any) {
    // Handle Prisma unique constraint violation for email
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      redirect("/register?error=EmailAlreadyExists");
    }

    // Handle other registration errors
    redirect("/register?error=RegistrationFailed");
  }
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

// reset password
export async function requestPasswordReset(email: string) {
  console.log("Requesting password reset for email:", email);
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message: "If the email exists, a reset link has been sent.",
      };
    }

    // Check if user has a password (OAuth users might not)
    if (!user.password) {
      return {
        success: false,
        error:
          "This account was created with a social provider. Please use that provider to sign in.",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: "If the email exists, a reset link has been sent.",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Find valid token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return {
        success: false,
        error: "Invalid or expired reset token.",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return {
      success: true,
      message: "Password has been reset successfully.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function fetchBalances() {
  try {
    const session = await auth();

    if (!session?.user) {
      return [];
    }
    const user = session.user;

    const balances = await prisma.balance.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    return balances;
  } catch (error) {
    console.error("Error fetching balances:", error);
    return [];
  }
}

export async function fetchBalanceById(id: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    const user = session.user;

    const balance = await prisma.balance.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (balance?.userId !== user.id) {
      return null;
    }

    return balance;
  } catch (error) {
    console.error("Error fetching balance by ID:", error);
    return null;
  }
}

export async function fetchTransactions() {
  try {
    const session = await auth();

    if (!session?.user) {
      return [];
    }
    const user = session.user;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        user: true,
        balance: true,
      },
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function fetchTransactionsByBalanceId(balanceId: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      return [];
    }
    const user = session.user;

    // check if the balance belongs to the user
    const balance = await prisma.balance.findUnique({
      where: {
        id: balanceId,
        userId: user.id,
      },
    });

    if (!balance || balance.userId !== user.id) {
      return [];
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        balanceId: balanceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        balance: true,
      },
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function createTransaction(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    const user = session.user;

    const dateString = formData.get("date") as string;
    const transactionDate = dateString ? new Date(dateString) : new Date();

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: parseFloat(formData.get("amount") as string),
        type: formData.get("type") as string,
        description: formData.get("description") as string,
        date: transactionDate,
        categoryId:
          (formData.get("categoryId") as string) === ""
            ? null
            : (formData.get("categoryId") as string),
        balanceId: formData.get("balanceId") as string,
      },
      include: {
        category: true,
        balance: true,
      },
    });

    // update balance
    await prisma.balance.update({
      where: {
        id: transaction.balanceId as string,
      },
      data: {
        amount: {
          [transaction.type === "income" ? "increment" : "decrement"]:
            transaction.amount,
        },
      },
    });

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return null;
  }
}

export async function changePassword(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Not authenticated" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!currentPassword || !newPassword) {
      return { success: false, message: "Missing required fields" };
    }

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      return { success: false, message: "User not found or no password set" };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Failed to change password" };
  }
}
