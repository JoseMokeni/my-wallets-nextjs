"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBalances, fetchTransactions } from "@/lib/actions";
import { Balance, Transaction, Category } from "@/lib/generated/prisma";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TransactionWithCategory extends Transaction {
  category: Category;
  balance: Balance;
}

const Page = () => {
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

  // Calculate total balance across all accounts
  const totalBalance = balances.reduce(
    (sum, balance) => sum + balance.amount,
    0
  );

  // Calculate income and expenses from recent transactions
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBalance.toLocaleString("en-US", {
                style: "currency",
                currency: balances[0]?.currency || "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {balances.length} account{balances.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +
              {income.toLocaleString("en-US", {
                style: "currency",
                currency: balances[0]?.currency || "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">All time income</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -
              {expenses.toLocaleString("en-US", {
                style: "currency",
                currency: balances[0]?.currency || "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">All time expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                income - expenses >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {income - expenses >= 0 ? "+" : ""}
              {(income - expenses).toLocaleString("en-US", {
                style: "currency",
                currency: balances[0]?.currency || "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Income minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions and Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Transactions
              <Link href="/balances">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description || "No description"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category?.name} •{" "}
                          {transaction.balance?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {transaction.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: transaction.balance?.currency || "USD",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Account Balances
              <Link href="/balances">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {balances.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No balances yet</p>
                <Link href="/balances">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Balance
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {balances.slice(0, 4).map((balance) => (
                  <Link key={balance.id} href={`/balances/${balance.id}`}>
                    <div className="flex mb-2 items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Wallet className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{balance.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {balance.currency} Account
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {balance.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: balance.currency,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {balances.length > 4 && (
                  <div className="text-center pt-2">
                    <Link href="/balances">
                      <Button variant="ghost" size="sm">
                        +{balances.length - 4} more accounts
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/balances">
              <Button variant="outline" className="w-full justify-start">
                <Wallet className="w-4 h-4 mr-2" />
                Manage Balances
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/balances">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
