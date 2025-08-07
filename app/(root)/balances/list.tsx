import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Balance } from "@/lib/generated/prisma";
import Link from "next/link";
import React from "react";

const BalancesList = ({ balances }: { balances: Balance[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {balances.map((balance) => (
        <Link key={balance.id} href={`/balances/${balance.id}`}>
          <Card className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                {balance.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {balance.currency} Balance
              </CardDescription>
            </CardHeader>
            <CardAction className="pt-2 pb-4 px-6">
              <div className="text-2xl font-bold text-primary">
                {balance.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: balance.currency,
                })}
              </div>
            </CardAction>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default BalancesList;
