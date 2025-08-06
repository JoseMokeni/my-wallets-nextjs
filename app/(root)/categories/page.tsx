import { auth } from "@/auth";
import { Category } from "@/lib/generated/prisma";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  const userId = session.user.id;

  let categories: Category[] = [];

  try {
    categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId: userId as string }],
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <div>Error loading categories</div>;
  }

  console.log("Categories:", categories);

  return <div>Categories</div>;
};

export default Page;
