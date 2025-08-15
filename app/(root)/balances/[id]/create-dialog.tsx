"use client";
import React, { useState, useEffect } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Balance, Category, Transaction } from "@/lib/generated/prisma";
import { createTransaction } from "@/lib/actions";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface CreateTransactionDialogProps {
  balance: Balance | null;
  onTransactionCreated?: (transaction: Transaction) => void;
}

const CreateTransactionDialog = ({
  balance,
  onTransactionCreated,
}: CreateTransactionDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amountError, setAmountError] = useState("");
  const [transactionType, setTransactionType] = useState("income");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch("/api/categories");

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validateAmount = (amount: number, type: string) => {
    if (type === "expense" && balance && amount > balance.amount) {
      setAmountError(
        `Amount cannot exceed balance (${balance.amount.toFixed(2)})`
      );
      return false;
    }
    setAmountError("");
    return true;
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount) && transactionType) {
      validateAmount(amount, transactionType);
    }
  };

  const handleTypeChange = (type: string) => {
    setTransactionType(type);

    // Clear category selection when switching to income
    if (type === "income") {
      setSelectedCategory("");
    }

    const amountInput = document.getElementById("amount") as HTMLInputElement;
    if (amountInput && amountInput.value) {
      const amount = parseFloat(amountInput.value);
      if (!isNaN(amount)) {
        validateAmount(amount, type);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      const amount = parseFloat(formData.get("amount") as string);
      const type = formData.get("type") as string;

      if (isNaN(amount) || !type) {
        toast.error("Please fill in all required fields correctly.");
        return;
      }

      // Validate amount for expense type
      if (!validateAmount(amount, type)) {
        toast.error("Amount validation failed.");
        return;
      }

      // Add categoryId to formData
      formData.set("categoryId", selectedCategory);

      // Combine date and time into a single Date object
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(hours, minutes);
      formData.set("date", combinedDateTime.toISOString());

      const createdTransaction = await createTransaction(formData);

      if (!createdTransaction) {
        toast.error("Failed to create transaction");
        return;
      }

      toast.success("Transaction created successfully!");

      setIsDialogOpen(false);
      setSelectedCategory("");
      setAmountError("");
      setTransactionType("income");
      setSelectedDate(new Date());
      const now = new Date();
      setSelectedTime(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );

      if (event.currentTarget) {
        event.currentTarget.reset();
      }

      if (onTransactionCreated) {
        onTransactionCreated(createdTransaction);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (open) {
          // Reset form when opening
          setSelectedCategory("");
          setAmountError("");
          setTransactionType("income");
          setSelectedDate(new Date());
          const now = new Date();
          setSelectedTime(
            `${now.getHours().toString().padStart(2, "0")}:${now
              .getMinutes()
              .toString()
              .padStart(2, "0")}`
          );
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" className="mb-4 mt-2">
          Create Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a transaction</DialogTitle>
          <form onSubmit={handleSubmit} method="post">
            <DialogDescription>
              Use this form to create a new transaction.
            </DialogDescription>

            <Label htmlFor="amount" className="mt-4">
              Amount *
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              id="amount"
              name="amount"
              className={cn(
                "mt-2",
                amountError && "border-red-500 focus:border-red-500"
              )}
              onChange={handleAmountChange}
              required
            />
            {amountError && (
              <p className="text-sm text-red-500 mt-1">{amountError}</p>
            )}

            <Label htmlFor="description" className="mt-4">
              Description
            </Label>
            <Input
              type="text"
              placeholder="Enter transaction description"
              id="description"
              name="description"
              className="mt-2"
            />

            <Label htmlFor="type" className="mt-4">
              Type *
            </Label>
            <Select
              name="type"
              onValueChange={handleTypeChange}
              value={transactionType}
              required
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" defaultChecked>
                  Income
                </SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="categoryId" className="mt-4">
              Category {transactionType !== "income" && "*"}
            </Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className="mt-2 w-full justify-between"
                  disabled={transactionType === "income"}
                >
                  {selectedCategory && transactionType !== "income"
                    ? categories.find(
                        (category) => category.id === selectedCategory
                      )?.name
                    : transactionType === "income"
                    ? "No category for income"
                    : "Select category..."}
                  <ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <ScrollArea className="h-[200px]">
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => {
                            setSelectedCategory(category.id);
                            setCategoryOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategory === category.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="mt-4">
              <Label className="text-sm font-medium">Date & Time *</Label>
              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <Popover
                    open={datePickerOpen}
                    onOpenChange={setDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date);
                            setDatePickerOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-32">
                  <Input
                    type="time"
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Label htmlFor="balance" className="mt-4">
              Balance *
            </Label>
            <Input
              type="text"
              id="balance"
              name="balance"
              value={balance?.name || "Loading..."}
              disabled
              className="mt-2"
            />
            <input type="hidden" name="balanceId" value={balance?.id} />

            <div className="mt-4">
              <Button type="submit" disabled={isSubmitting || !!amountError}>
                {isSubmitting ? "Creating..." : "Create Transaction"}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateTransactionDialog;
