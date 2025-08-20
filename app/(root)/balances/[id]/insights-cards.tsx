"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsData, formatCurrency } from "@/lib/analytics";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target } from "lucide-react";

interface InsightsCardsProps {
  analytics: AnalyticsData;
  currency: string;
}

export default function InsightsCards({ analytics, currency }: InsightsCardsProps) {
  const ChangeIcon = analytics.weeklyComparison.changePercent >= 0 ? TrendingUp : TrendingDown;
  const changeColor = analytics.weeklyComparison.changePercent >= 0 ? "text-red-500" : "text-green-500";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(analytics.totalIncome, currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.transactionCount} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(analytics.totalExpenses, currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average: {formatCurrency(analytics.averageTransaction, currency)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Change</CardTitle>
          <DollarSign className={`h-4 w-4 ${analytics.netChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${analytics.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(analytics.netChange, currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.netChange >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Largest Transaction</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.largestTransaction 
              ? formatCurrency(analytics.largestTransaction.amount, currency)
              : formatCurrency(0, currency)
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.largestTransaction?.type || 'No transactions'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {analytics.mostUsedCategory?.category || 'No categories'}
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.mostUsedCategory?.count || 0} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Change</CardTitle>
          <ChangeIcon className={`h-4 w-4 ${changeColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${changeColor}`}>
            {analytics.weeklyComparison.changePercent.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            vs last week: {formatCurrency(analytics.weeklyComparison.change, currency)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}