"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Transaction, Category } from "@/lib/generated/prisma";
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

interface TransactionDetailsDialogProps {
  transaction:
    | (Transaction & {
        category: Category;
        balance: { currency: string; name: string };
      })
    | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionDetailsDialog = ({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) => {
  if (!transaction) return null;

  const iconName = transaction.category?.icon as keyof typeof iconMap;
  const IconComponent = iconMap[iconName] || ShoppingCart;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            View complete information about this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Amount:</span>
            <span className="text-lg font-semibold">
              {transaction.amount.toLocaleString("en-US", {
                style: "currency",
                currency: transaction.balance.currency,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Type:</span>
            <Badge
              variant={
                transaction.type === "income" ? "default" : "destructive"
              }
            >
              {transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Category:</span>
            <div className="flex items-center gap-2">
              {transaction.category ? (
                <>
                  <IconComponent size={16} />
                  <span>{transaction.category.name}</span>
                </>
              ) : (
                <span>-</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Balance:</span>
            <span>{transaction.balance.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Date:</span>
            <span>
              {new Date(transaction.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {transaction.description && (
            <div className="space-y-2">
              <span className="font-medium">Description:</span>
              <p className="text-sm text-muted-foreground">
                {transaction.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
