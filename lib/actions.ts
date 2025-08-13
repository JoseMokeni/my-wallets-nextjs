"use server";

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function signInWithGithub() {
  await signIn("github", {
    redirectTo: "/",
  });
}

export async function signInWithGoogle() {
  await signIn("google", {
    redirectTo: "/",
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
      redirectTo: "/",
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
    redirectTo: "/",
  });
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

    console.log("Fetched transactions:", transactions);

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

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: parseFloat(formData.get("amount") as string),
        type: formData.get("type") as string,
        description: formData.get("description") as string,
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
