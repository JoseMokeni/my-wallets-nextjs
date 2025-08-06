import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Food & Dining", icon: "Utensils" },
  { name: "Transportation", icon: "Car" },
  { name: "Shopping", icon: "ShoppingBag" },
  { name: "Entertainment", icon: "Gamepad2" },
  { name: "Bills & Utilities", icon: "Home" },
  { name: "Healthcare", icon: "Heart" },
  { name: "Education", icon: "Book" },
  { name: "Travel", icon: "Plane" },
  { name: "Groceries", icon: "ShoppingCart" },
  { name: "Gas", icon: "Fuel" },
  { name: "Coffee & Drinks", icon: "Coffee" },
  { name: "Gifts & Donations", icon: "Gift" },
  { name: "Business", icon: "ShoppingBag" },
  { name: "Personal Care", icon: "Heart" },
  { name: "Home & Garden", icon: "Home" },
  { name: "Sports & Fitness", icon: "Gamepad2" },
];

async function main() {
  console.log("Start seeding default categories...");

  for (const category of defaultCategories) {
    const result = await prisma.category.create({
      data: {
        name: category.name,
        icon: category.icon,
      },
    });
    console.log(`Created category: ${result.name} with icon: ${result.icon}`);
  }

  console.log("Seeding finished.");
}

main();
