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
      gradient: "bg-gradient-to-br from-brand-blue/10 to-brand-purple/10",
      iconColor: "text-brand-blue",
      borderColor: "border-l-brand-blue",
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      description: "All time activity",
      icon: Activity,
      gradient: "bg-gradient-to-br from-brand-teal/10 to-brand-blue/10",
      iconColor: "text-brand-teal",
      borderColor: "border-l-brand-teal",
    },
    {
      title: "This Month",
      value: thisMonthTransactions.length,
      description: "Transactions this month",
      icon: Calendar,
      gradient: "bg-gradient-to-br from-brand-orange/10 to-brand-pink/10",
      iconColor: "text-brand-orange",
      borderColor: "border-l-brand-orange",
    },
    {
      title: "Top Category",
      value: mostUsedCategory,
      description: "Most used category",
      icon: Target,
      gradient: "bg-gradient-to-br from-brand-purple/10 to-brand-pink/10",
      iconColor: "text-brand-purple",
      borderColor: "border-l-brand-purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className={`relative overflow-hidden border-l-4 ${card.borderColor} ${card.gradient} hover:shadow-lg transition-all duration-200`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-background/50 ${card.iconColor}`}>
              <card.icon className="h-4 w-4" />
            </div>
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
