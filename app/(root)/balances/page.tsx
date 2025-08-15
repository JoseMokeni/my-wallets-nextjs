"use client";
import React, { useEffect, useState } from "react";
import CreateBalanceDialog from "./dialog";
import { fetchBalances } from "@/lib/actions";
import { Balance } from "@/lib/generated/prisma";
import BalancesList from "./list";

const Page = () => {
  const [balances, setBalances] = useState<Balance[]>([]);

  const handleBalanceCreated = (balance: Balance) => {
    setBalances((prev) => [balance, ...prev]);
  };

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
      <CreateBalanceDialog onBalanceCreated={handleBalanceCreated} />
      {balances.length === 0 ? (
        <p className="text-muted-foreground">No balances found.</p>
      ) : (
        <BalancesList balances={balances} />
      )}
    </div>
  );
};

export default Page;
