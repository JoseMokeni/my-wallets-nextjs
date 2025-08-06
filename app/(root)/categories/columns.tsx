"use client";

import { Category } from "@/lib/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import {
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Heart,
  Gamepad2,
  Book,
  Plane,
  Gift,
  Utensils,
  Fuel,
  ShoppingBag,
} from "lucide-react";

const iconMap = {
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Heart,
  Gamepad2,
  Book,
  Plane,
  Gift,
  Utensils,
  Fuel,
  ShoppingBag,
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const iconName = row.original.icon as keyof typeof iconMap;
      const IconComponent = iconMap[iconName] || ShoppingCart;
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2">
          <IconComponent size={16} />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const category = row.original;
      return category.userId ? "Custom" : "Default";
    },
  },
];
