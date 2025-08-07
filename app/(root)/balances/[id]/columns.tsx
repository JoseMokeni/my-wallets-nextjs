"use client";

import { Category } from "@/lib/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const columns: ColumnDef<Category>[] = [
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
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const router = useRouter();
  //     const [isDeleting, setIsDeleting] = useState(false);

  //     const handleDelete = async (id: string) => {
  //       if (isDeleting) return;

  //       setIsDeleting(true);
  //       try {
  //         const response = await fetch(`/api/categories/${id}`, {
  //           method: "DELETE",
  //         });

  //         if (!response.ok) {
  //           toast.error("Failed to delete category");
  //           return;
  //         }

  //         toast.success("Category deleted successfully");

  //         // Force a hard refresh of the page
  //         window.location.reload();
  //       } catch (error) {
  //         console.error("Error deleting category:", error);
  //         toast.error("Failed to delete category");
  //       } finally {
  //         setIsDeleting(false);
  //       }
  //     };

  //     return row.original.userId ? (
  //       <Button
  //         variant="destructive"
  //         onClick={() => handleDelete(row.original.id)}
  //         disabled={isDeleting}
  //       >
  //         {isDeleting ? "Deleting..." : "Delete"}
  //       </Button>
  //     ) : (
  //       ""
  //     );
  //   },
  // },
];
