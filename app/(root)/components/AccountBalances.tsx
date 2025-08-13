import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";
import { Balance } from "@/lib/generated/prisma";

interface AccountBalancesProps {
  balances: Balance[];
}

export const AccountBalances: React.FC<AccountBalancesProps> = ({
  balances,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Account Balances
          <Link href="/balances">
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <EmptyBalances />
        ) : (
          <BalancesList balances={balances} />
        )}
      </CardContent>
    </Card>
  );
};

const EmptyBalances: React.FC = () => (
  <div className="text-center py-4">
    <p className="text-muted-foreground mb-4">No balances yet</p>
    <Link href="/balances">
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Create First Balance
      </Button>
    </Link>
  </div>
);

interface BalancesListProps {
  balances: Balance[];
}

const BalancesList: React.FC<BalancesListProps> = ({ balances }) => {
  const displayedBalances = balances.slice(0, 4);
  const remainingCount = balances.length - 4;

  return (
    <div className="space-y-4">
      {displayedBalances.map((balance) => (
        <BalanceItem key={balance.id} balance={balance} />
      ))}
      {remainingCount > 0 && (
        <div className="text-center pt-2">
          <Link href="/balances">
            <Button variant="ghost" size="sm">
              +{remainingCount} more accounts
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

interface BalanceItemProps {
  balance: Balance;
}

const BalanceItem: React.FC<BalanceItemProps> = ({ balance }) => (
  <Link href={`/balances/${balance.id}`}>
    <div className="flex mb-2 items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Wallet className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{balance.name}</p>
          <p className="text-xs text-muted-foreground">
            {balance.currency} Account
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">
          {balance.amount.toLocaleString("en-US", {
            style: "currency",
            currency: balance.currency,
          })}
        </p>
      </div>
    </div>
  </Link>
);
