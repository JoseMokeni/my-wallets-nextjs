import { DataTable } from "@/components/ui/data-table";
import { Transaction } from "@/lib/generated/prisma";
import React, { useState } from "react";

const Page = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : null}
      {/* <CreateTransactionDialog onTransactionCreated={fetchTransactions} /> */}
      <DataTable columns={columns} data={transactions} />
    </div>
  );
};

export default Page;
