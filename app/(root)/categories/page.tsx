"use client";

import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/lib/generated/prisma";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CreateCategoryDialog from "./dialog";

const Page = () => {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      redirect("/login");
      return;
    }

    fetchCategories();
  }, [session, status]);

  const handleCreateCategory = (category: Category) => {
    setCategories((prev) => [category, ...prev]);
  };

  const handleCategoryDelete = (id: string) => {
    setCategories((categories) =>
      categories.filter((category) => category.id !== id)
    );
  };

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full space-y-8">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 p-6 border">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Categories
              </h1>
              <p className="text-muted-foreground mt-2">
                Organize your transactions with custom categories
              </p>
            </div>
            <CreateCategoryDialog onCategoryCreated={handleCreateCategory} />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-purple/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full transform -translate-x-12 translate-y-12" />
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-12 rounded-xl border bg-gradient-to-br from-surface-1 to-surface-2">
          <div className="p-4 rounded-full bg-brand-blue/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted-foreground">Create your first category to organize your transactions.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          hideColumnsOnMobile={["createdAt"]}
          meta={{
            handleCategoryDelete,
          }}
        />
      )}
    </div>
  );
};

export default Page;
