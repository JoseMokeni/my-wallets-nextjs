"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Balance } from "@/lib/generated/prisma";

interface CreateBalanceDialogProps {
  onBalanceCreated?: (balance: Balance) => void;
}

const CreateBalanceDialog = ({
  onBalanceCreated,
}: CreateBalanceDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get("balance-name") as string;
      const amount = parseFloat(formData.get("balance-amount") as string);
      const currency =
        formData.get("balance-currency") === "other"
          ? (formData.get("custom-currency") as string)
          : (formData.get("balance-currency") as string);

      if (!name || isNaN(amount) || !currency) {
        alert("Please fill in all fields correctly.");
        return;
      }
      const response = await fetch("/api/balances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount, currency }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || "Failed to create balance"}`);
        return;
      }

      const newBalance = await response.json();
      console.log("New balance created:", newBalance);
      toast.success("Balance created successfully!");

      setIsDialogOpen(false);

      if (event.currentTarget) {
        event.currentTarget.reset();
      }

      // Refresh categories list
      if (onBalanceCreated) {
        onBalanceCreated(newBalance);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mb-4 mt-2">
          Create Balance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a balance</DialogTitle>
          <form onSubmit={handleSubmit} method="post">
            <DialogDescription>
              Use this form to create a new balance to put your money in.
            </DialogDescription>
            <Label htmlFor="balance-name" className="mt-4">
              Balance Name
            </Label>
            <Input
              type="text"
              placeholder="Savings, Checking, etc."
              id="balance-name"
              name="balance-name"
              className="mt-2"
              required
            />

            <Label htmlFor="balance-amount" className="mt-4">
              Initial Amount
            </Label>
            <Input
              type="number"
              placeholder="0.00"
              id="balance-amount"
              name="balance-amount"
              className="mt-2"
              required
            />

            <Label htmlFor="balance-currency" className="mt-4">
              Currency
            </Label>
            <Select
              name="balance-currency"
              value={selectedCurrency}
              onValueChange={(value) => {
                setSelectedCurrency(value);
              }}
              required
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                <SelectItem value="TND">TND - Tunisian Dinar</SelectItem>
                <SelectItem value="CDF">CDF - Congolese Franc</SelectItem>
                <SelectItem value="XOF">
                  XOF - West African CFA Franc
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Enter currency code"
              id="custom-currency-input"
              name="custom-currency"
              className="mt-2"
              style={{
                display: selectedCurrency === "other" ? "block" : "none",
              }}
              pattern="^[A-Z]{3,5}$"
              maxLength={5}
            />
            <div className="mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Balance"}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBalanceDialog;
