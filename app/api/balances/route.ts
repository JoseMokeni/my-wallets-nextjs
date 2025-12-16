import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { name, amount, currency } = await request.json();
    if (!name || !amount || !currency) {
      return NextResponse.json(
        { error: "Name, amount, and currency are required" },
        { status: 400 }
      );
    }

    const newBalance = await prisma.balance.create({
      data: {
        name,
        amount,
        currency,
        userId: userId as string,
      },
    });

    await prisma.transaction.create({
      data: {
        userId: userId as string,
        amount,
        type: "income",
        description: "Initial balance",
        categoryId: null,
        balanceId: newBalance.id,
      },
    });

    return NextResponse.json(newBalance, { status: 201 });
  } catch (error) {
    console.error("Error creating balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
