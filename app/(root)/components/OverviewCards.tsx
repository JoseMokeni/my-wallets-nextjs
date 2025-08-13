import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Activity, Calendar, Target } from "lucide-react";
import { DashboardStats } from "@/hooks/use-dashboard-data";

interface OverviewCardsProps {
  stats: DashboardStats;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ stats }) => {
  const {
    totalAccounts,
    totalTransactions,
    currencies,
    thisMonthTransactions,
    mostUsedCategory,
  } = stats;

  const cards = [
    {
      title: "Total Accounts",
      value: totalAccounts,
      description: `${currencies.length} currenc${
        currencies.length !== 1 ? "ies" : "y"
      }`,
      icon: Wallet,
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      description: "All time activity",
      icon: Activity,
    },
    {
      title: "This Month",
      value: thisMonthTransactions.length,
      description: "Transactions this month",
      icon: Calendar,
    },
    {
      title: "Top Category",
      value: mostUsedCategory,
      description: "Most used category",
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
