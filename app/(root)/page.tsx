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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Overview Cards */}
      <OverviewCards stats={stats} />

      {/* Recent Transactions and Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={stats.recentTransactions} />
        <AccountBalances balances={balances} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Page;
