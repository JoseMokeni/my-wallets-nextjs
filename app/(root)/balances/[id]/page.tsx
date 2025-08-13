"use client";
import { DataTable } from "@/components/ui/data-table";
import { Balance, Transaction } from "@/lib/generated/prisma";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { fetchTransactionsByBalanceId, fetchBalanceById } from "@/lib/actions";
import CreateTransactionDialog from "./create-dialog";

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { id } = useParams();

  const getData = async () => {
    const data = await fetchTransactionsByBalanceId(id as string);
    setTransactions(data);
  };

  const getBalance = async () => {
    const data = await fetchBalanceById(id as string);
    setBalance(data);
  };

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

  useEffect(() => {
    getData();
    getBalance();
  }, [id]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">
        Transactions for{" "}
        {balance ? `balance : ${balance.name}` : "this balance"}
      </h1>
      {balance ? (
        <p>
          Amount:{" "}
          {balance.amount.toLocaleString("en-US", {
            style: "currency",
            currency: balance.currency || "USD",
          })}
        </p>
      ) : null}

      <div className="flex items-center gap-4 my-4">
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
        <p className="text-muted-foregtound">No transactions found.</p>
      ) : null}
      <CreateTransactionDialog
        balance={balance}
        onTransactionCreated={handleTransactionCreated}
      />
      <DataTable
        columns={columns}
        data={filteredTransactions}
        hideColumnsOnMobile={["category"]}
      />
    </div>
  );
};

export default Page;
