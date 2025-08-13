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
      console.log("Fetched categories:", data);
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
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-muted-foreground">No categories found.</p>
      ) : null}
      <CreateCategoryDialog onCategoryCreated={handleCreateCategory} />
      <DataTable
        columns={columns}
        data={categories}
        hideColumnsOnMobile={["createdAt"]}
        meta={{
          handleCategoryDelete,
        }}
      />
    </div>
  );
};

export default Page;
