"use client";
import { DataTable } from "@/components/ui/data-table";
import { Balance, Transaction } from "@/lib/generated/prisma";
import React, { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { columns } from "./columns";
import { fetchTransactions, fetchBalanceById } from "@/lib/actions";

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);

  const { id } = useParams();

  const getData = async () => {
    const data = await fetchTransactions();
    setTransactions(data);
  };

  const getBalance = async () => {
    const data = await fetchBalanceById(id as string);
    setBalance(data);
  };

  useEffect(() => {
    getData();
    getBalance();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">
        Transactions for{" "}
        {balance ? `balance : ${balance.name}` : "this balance"}
      </h1>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : null}
      {/* <CreateTransactionDialog onTransactionCreated={fetchTransactions} /> */}
      <DataTable columns={columns} data={transactions} />
    </div>
  );
};

export default Page;
