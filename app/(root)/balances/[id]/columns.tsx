"use client";

import { Category, Transaction } from "@/lib/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as string);
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
      const type = row.getValue("type") as string;
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: row.getValue("currency") as string,
      });
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return category.charAt(0).toUpperCase() + category.slice(1);
    },
  },
];
