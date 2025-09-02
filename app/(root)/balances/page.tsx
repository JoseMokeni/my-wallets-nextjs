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
    };

    loadBalances();
  }, []);
  return (
    <div className="w-full space-y-8">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 p-6 border">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Accounts
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your accounts and track your finances
              </p>
            </div>
            <CreateBalanceDialog onBalanceCreated={handleBalanceCreated} />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-purple/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full transform -translate-x-12 translate-y-12" />
      </div>
      
      {balances.length === 0 ? (
        <div className="text-center py-12 rounded-xl border bg-gradient-to-br from-surface-1 to-surface-2">
          <div className="p-4 rounded-full bg-brand-blue/10 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 6h20v2H2zm0 5h20v2H2zm0 5h20v2H2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No balances found</h3>
          <p className="text-muted-foreground">Create your first balance to get started with tracking your finances.</p>
        </div>
      ) : (
        <BalancesList balances={balances} />
      )}
    </div>
  );
};

export default Page;
