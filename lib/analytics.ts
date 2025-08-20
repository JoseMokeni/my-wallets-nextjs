import { Transaction, Category } from "@/lib/generated/prisma";

export interface TransactionWithCategory extends Transaction {
  category?: Category | null;
}

export interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  transactionCount: number;
  averageTransaction: number;
  largestTransaction: Transaction | null;
  mostUsedCategory: { category: string; count: number } | null;
  categoryBreakdown: { category: string; amount: number; count: number }[];
  monthlyTrend: { month: string; income: number; expenses: number }[];
  dailyPattern: { day: string; amount: number; count: number }[];
  weeklyComparison: {
    thisWeek: number;
    lastWeek: number;
    change: number;
    changePercent: number;
  };
}

export function calculateAnalytics(transactions: TransactionWithCategory[]): AnalyticsData {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netChange = totalIncome - totalExpenses;
  const transactionCount = transactions.length;
  const averageTransaction = transactionCount > 0 ? (totalIncome + totalExpenses) / transactionCount : 0;

  const largestTransaction = transactions.reduce((largest, current) => {
    if (!largest || current.amount > largest.amount) return current;
    return largest;
  }, null as Transaction | null);

  // Category analysis
  const categoryMap = new Map<string, { amount: number; count: number }>();
  transactions.forEach(t => {
    const categoryName = t.category?.name || "Uncategorized";
    const existing = categoryMap.get(categoryName) || { amount: 0, count: 0 };
    categoryMap.set(categoryName, {
      amount: existing.amount + (t.type === "expense" ? t.amount : 0),
      count: existing.count + 1
    });
  });

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.amount - a.amount);

  const mostUsedCategory = categoryBreakdown.length > 0 
    ? { category: categoryBreakdown[0].category, count: categoryBreakdown[0].count }
    : null;

  // Monthly trend (last 6 months)
  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  transactions.forEach(t => {
    const monthKey = new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const existing = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };
    if (t.type === "income") {
      existing.income += t.amount;
    } else {
      existing.expenses += t.amount;
    }
    monthlyMap.set(monthKey, existing);
  });

  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-6);

  // Daily pattern (last 7 days)
  const dailyMap = new Map<string, { amount: number; count: number }>();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return transactionDate >= weekAgo;
    })
    .forEach(t => {
      const dayKey = new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' });
      const existing = dailyMap.get(dayKey) || { amount: 0, count: 0 };
      dailyMap.set(dayKey, {
        amount: existing.amount + t.amount,
        count: existing.count + 1
      });
    });

  const dailyPattern = last7Days.map(day => ({
    day,
    ...(dailyMap.get(day) || { amount: 0, count: 0 })
  }));

  // Weekly comparison
  const now = new Date();
  const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);

  const thisWeekExpenses = transactions
    .filter(t => t.type === "expense" && new Date(t.date) >= thisWeekStart)
    .reduce((sum, t) => sum + t.amount, 0);

  const lastWeekExpenses = transactions
    .filter(t => t.type === "expense" && new Date(t.date) >= lastWeekStart && new Date(t.date) <= lastWeekEnd)
    .reduce((sum, t) => sum + t.amount, 0);

  const weeklyChange = thisWeekExpenses - lastWeekExpenses;
  const weeklyChangePercent = lastWeekExpenses > 0 ? (weeklyChange / lastWeekExpenses) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    netChange,
    transactionCount,
    averageTransaction,
    largestTransaction,
    mostUsedCategory,
    categoryBreakdown,
    monthlyTrend,
    dailyPattern,
    weeklyComparison: {
      thisWeek: thisWeekExpenses,
      lastWeek: lastWeekExpenses,
      change: weeklyChange,
      changePercent: weeklyChangePercent
    }
  };
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
}

export function getInsightMessage(analytics: AnalyticsData): string[] {
  const insights: string[] = [];

  if (analytics.categoryBreakdown.length > 0) {
    const topCategory = analytics.categoryBreakdown[0];
    const percentage = ((topCategory.amount / analytics.totalExpenses) * 100).toFixed(1);
    insights.push(`${topCategory.category} accounts for ${percentage}% of your expenses`);
  }

  if (analytics.weeklyComparison.changePercent !== 0) {
    const direction = analytics.weeklyComparison.changePercent > 0 ? "increased" : "decreased";
    const percentage = Math.abs(analytics.weeklyComparison.changePercent).toFixed(1);
    insights.push(`Your spending ${direction} by ${percentage}% this week`);
  }

  if (analytics.netChange > 0) {
    insights.push(`You saved ${formatCurrency(analytics.netChange)} this period`);
  } else if (analytics.netChange < 0) {
    insights.push(`You spent ${formatCurrency(Math.abs(analytics.netChange))} more than you earned`);
  }

  return insights;
}