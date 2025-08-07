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
    return NextResponse.json(newBalance, { status: 201 });
  } catch (error) {
    console.error("Error creating balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
