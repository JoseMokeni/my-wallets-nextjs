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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Category } from "@/lib/generated/prisma";

interface CreateCategoryDialogProps {
  onCategoryCreated?: (category: Category) => void;
}

const CreateCategoryDialog = ({
  onCategoryCreated,
}: CreateCategoryDialogProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string>("ShoppingCart");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconOptions = [
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Car", icon: Car },
    { name: "Home", icon: Home },
    { name: "Coffee", icon: Coffee },
    { name: "Heart", icon: Heart },
    { name: "Gamepad2", icon: Gamepad2 },
    { name: "Book", icon: Book },
    { name: "Plane", icon: Plane },
    { name: "Gift", icon: Gift },
    { name: "Utensils", icon: Utensils },
    { name: "Fuel", icon: Fuel },
    { name: "ShoppingBag", icon: ShoppingBag },
  ];

  const selectedIconComponent =
    iconOptions.find((option) => option.name === selectedIcon)?.icon ||
    ShoppingCart;
  const SelectedIcon = selectedIconComponent;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const categoryName = formData.get("category-name") as string;
    const categoryIcon = formData.get("category-icon") as string;

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName,
          icon: categoryIcon,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const newCategory = await response.json();

      // Reset form and close dialog
      setSelectedIcon("ShoppingCart");
      setIsPopoverOpen(false);
      setIsDialogOpen(false);

      if (event.currentTarget) {
        event.currentTarget.reset();
      }

      // Add new category to the list
      if (onCategoryCreated) {
        onCategoryCreated(newCategory);
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
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a custom category</DialogTitle>
          <form onSubmit={handleSubmit} method="post">
            <DialogDescription>
              Use this form to create a new category for your transactions.
            </DialogDescription>
            <Label htmlFor="category-name" className="mt-4">
              Category Name
            </Label>
            <Input
              type="text"
              placeholder="Good Actions"
              id="category-name"
              name="category-name"
              className="mt-2"
              required
            />

            <Label htmlFor="category-icon" className="mt-4">
              Category Icon
            </Label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mt-2"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <SelectedIcon size={18} />
                    <span>Select Icon</span>
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <Button
                        key={option.name}
                        variant={
                          selectedIcon === option.name ? "default" : "ghost"
                        }
                        size="sm"
                        className="h-12 w-12"
                        onClick={() => {
                          setSelectedIcon(option.name);
                          setIsPopoverOpen(false);
                        }}
                        type="button"
                      >
                        <IconComponent size={20} />
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            <input type="hidden" name="category-icon" value={selectedIcon} />

            <div className="mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
