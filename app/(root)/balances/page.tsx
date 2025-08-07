"use client";
import React, { useEffect, useState } from "react";
import CreateBalanceDialog from "./dialog";
import { fetchBalances } from "@/lib/actions";
import { Balance } from "@/lib/generated/prisma";
import BalancesList from "./list";

const Page = () => {
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    const loadBalances = async () => {
      const fetchedBalances = await fetchBalances();
      setBalances(fetchedBalances);
      console.log("Fetched balances:", fetchedBalances);
    };

    loadBalances();
  }, []);
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Balances</h1>
      <p className="text-gray-600">Manage your balances here.</p>
      <CreateBalanceDialog onBalanceCreated={fetchBalances} />
      {balances.length === 0 ? (
        <p className="text-gray-500">No balances found.</p>
      ) : (
        <BalancesList balances={balances} />
      )}
    </div>
  );
};

export default Page;
