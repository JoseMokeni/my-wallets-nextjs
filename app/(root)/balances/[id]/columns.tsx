"use client";

import { Button } from "@/components/ui/button";
import { Category, Transaction } from "@/lib/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import TransactionDetailsDialog from "./details-dialog";
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
import { Badge } from "@/components/ui/badge";

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

const ActionsCell = ({ row }: { row: any }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const transaction = row.original as Transaction & {
    category: Category;
    balance: { currency: string; name: string };
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setDetailsOpen(true)}>
        View Details
      </Button>
      <TransactionDetailsDialog
        transaction={transaction}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};

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
      if (type === "income") {
        return <Badge>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
      } else {
        return (
          <Badge variant="destructive">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const transaction = row.original as Transaction & {
        balance: { currency: string };
      };
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: transaction.balance?.currency || "USD",
      });
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as Category;
      if (!category) return "-";
      const iconName = category.icon as keyof typeof iconMap;
      const IconComponent = iconMap[iconName] || ShoppingCart;
      return (
        <div className="flex items-center gap-2">
          <IconComponent size={16} />
          <span>
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionsCell,
  },
];
