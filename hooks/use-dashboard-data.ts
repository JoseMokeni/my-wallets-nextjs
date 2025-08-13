"use client";

import { useEffect, useState } from "react";
import { fetchBalances, fetchTransactions } from "@/lib/actions";
import { Balance, Transaction, Category } from "@/lib/generated/prisma";

export interface TransactionWithCategory extends Transaction {
  category: Category;
  balance: Balance;
}

export interface DashboardStats {
  totalAccounts: number;
  totalTransactions: number;
  currencies: string[];
  thisMonthTransactions: TransactionWithCategory[];
  mostUsedCategory: string;
  recentTransactions: TransactionWithCategory[];
}

export const useDashboardData = () => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [fetchedBalances, fetchedTransactions] = await Promise.all([
          fetchBalances(),
          fetchTransactions(),
        ]);

        setBalances(fetchedBalances);
        setTransactions(fetchedTransactions as TransactionWithCategory[]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate statistics
  const stats: DashboardStats = {
    totalAccounts: balances.length,
    totalTransactions: transactions.length,
    currencies: [...new Set(balances.map((b) => b.currency))],
    thisMonthTransactions: getThisMonthTransactions(transactions),
    mostUsedCategory: getMostUsedCategory(transactions),
    recentTransactions: getRecentTransactions(transactions),
  };

  return { balances, transactions, loading, stats };
};

const getThisMonthTransactions = (transactions: TransactionWithCategory[]) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return transactions.filter((t) => new Date(t.date) >= firstDayOfMonth);
};

const getMostUsedCategory = (transactions: TransactionWithCategory[]) => {
  const categoryCount = transactions.reduce((acc, t) => {
    const categoryName = t.category?.name || "Uncategorized";
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCount).sort(
    ([, a], [, b]) => b - a
  );

  if (sortedCategories.length === 0) return "None";

  // If the top category is "Uncategorized" and there's a second category, use the second one
  if (
    sortedCategories[0][0] === "Uncategorized" &&
    sortedCategories.length > 1
  ) {
    return sortedCategories[1][0];
  }

  return sortedCategories[0][0];
};

const getRecentTransactions = (transactions: TransactionWithCategory[]) => {
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};
