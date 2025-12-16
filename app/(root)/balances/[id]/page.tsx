"use client";
import { DataTable } from "@/components/ui/data-table";
import { Balance, Transaction } from "@/lib/generated/prisma";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { fetchTransactionsByBalanceId, fetchBalanceById } from "@/lib/actions";
import CreateTransactionDialog from "./create-dialog";
import { calculateAnalytics, TransactionWithCategory } from "@/lib/analytics";
import InsightsCards from "./insights-cards";
import InsightsCharts from "./insights-charts";
import SmartInsights from "./smart-insights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { id } = useParams();

  const getData = useCallback(async () => {
    const data = await fetchTransactionsByBalanceId(id as string);
    setTransactions(data);
  }, [id]);

  const getBalance = useCallback(async () => {
    const data = await fetchBalanceById(id as string);
    setBalance(data);
  }, [id]);

  const handleTransactionCreated = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    // update amount
    setBalance((prev) => {
      if (!prev) return null;
      const newAmount =
        transaction.type === "income"
          ? prev.amount + transaction.amount
          : prev.amount - transaction.amount;
      return { ...prev, amount: newAmount };
    });
  };

  const filteredTransactions = useMemo(() => {
    if (typeFilter === "all") return transactions;
    return transactions.filter(
      (transaction) => transaction.type === typeFilter
    );
  }, [transactions, typeFilter]);

  const analytics = useMemo(() => {
    return calculateAnalytics(transactions as TransactionWithCategory[]);
  }, [transactions]);

  useEffect(() => {
    getData();
    getBalance();
  }, [id, getData, getBalance]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {balance ? balance.name : "Balance Details"}
          </h1>
          {balance ? (
            <p className="text-lg text-muted-foreground">
              Current Balance:{" "}
              <span className="font-semibold text-foreground">
                {balance.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: balance.currency || "USD",
                })}
              </span>
            </p>
          ) : null}
        </div>
        <CreateTransactionDialog
          balance={balance}
          onTransactionCreated={handleTransactionCreated}
        />
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {transactions.length > 0 ? (
            <>
              <InsightsCards
                analytics={analytics}
                currency={balance?.currency || "USD"}
              />
              <SmartInsights analytics={analytics} />
              <InsightsCharts
                analytics={analytics}
                currency={balance?.currency || "USD"}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No transactions yet
              </p>
              <p className="text-muted-foreground">
                Add some transactions to see insights and analytics
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="type-filter" className="text-sm font-medium">
              Filter by type:
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions found.</p>
          ) : (
            <DataTable
              columns={columns}
              data={filteredTransactions}
              hideColumnsOnMobile={["category"]}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
