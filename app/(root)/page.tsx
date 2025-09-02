"use client";

import React from "react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import {
  OverviewCards,
  RecentTransactions,
  AccountBalances,
  QuickActions,
  DashboardLoading,
} from "./components";

const Page = () => {
  const { balances, stats, loading } = useDashboardData();

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="w-full space-y-8">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 p-6 border">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-purple/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full transform -translate-x-12 translate-y-12" />
      </div>

      {/* Overview Cards */}
      <OverviewCards stats={stats} />

      {/* Recent Transactions and Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions transactions={stats.recentTransactions} />
        <AccountBalances balances={balances} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Page;
