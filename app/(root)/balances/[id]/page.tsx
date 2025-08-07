"use client";
import { DataTable } from "@/components/ui/data-table";
import { Balance, Transaction } from "@/lib/generated/prisma";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { fetchTransactionsByBalanceId, fetchBalanceById } from "@/lib/actions";
import CreateTransactionDialog from "./create-dialog";

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);

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

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : null}
      <CreateTransactionDialog
        balance={balance}
        onTransactionCreated={handleTransactionCreated}
      />
      <DataTable
        columns={columns}
        data={transactions}
        hideColumnsOnMobile={["category"]}
      />
    </div>
  );
};

export default Page;
