import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { TransactionWithCategory } from "@/hooks/use-dashboard-data";

interface RecentTransactionsProps {
  transactions: TransactionWithCategory[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <Link href="/balances">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TransactionItemProps {
  transaction: TransactionWithCategory;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            isIncome ? "bg-income-bg" : "bg-expense-bg"
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="w-4 h-4 text-income" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-expense" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">
            {transaction.description || "No description"}
          </p>
          <p className="text-xs text-muted-foreground">
            {transaction.category?.name || "No category"} •{" "}
            {transaction.balance?.name}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-medium ${
            isIncome ? "text-income" : "text-expense"
          }`}
        >
          {isIncome ? "+" : "-"}
          {transaction.amount.toLocaleString("en-US", {
            style: "currency",
            currency: transaction.balance?.currency || "USD",
          })}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
