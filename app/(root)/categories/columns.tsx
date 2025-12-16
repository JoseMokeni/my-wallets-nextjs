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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  {
    id: "actions",
    header: "Actions",
    cell: function ActionsCell({ row, table }) {
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async (id: string) => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
          const response = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            toast.error("Failed to delete category");
            return;
          }

          toast.success("Category deleted successfully");

          // Call the callback from the parent component to refresh data
          const meta = table.options.meta as {
            handleCategoryDelete?: (id: string) => void;
          };
          meta?.handleCategoryDelete?.(row.original.id);
        } catch (error) {
          console.error("Error deleting category:", error);
          toast.error("Failed to delete category");
        } finally {
          setIsDeleting(false);
        }
      };

      return row.original.userId ? (
        <Button
          variant="destructive"
          onClick={() => handleDelete(row.original.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      ) : (
        ""
      );
    },
  },
];
