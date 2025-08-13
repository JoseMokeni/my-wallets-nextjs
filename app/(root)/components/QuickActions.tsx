import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Activity, Plus } from "lucide-react";

export const QuickActions: React.FC = () => {
  const actions = [
    {
      href: "/balances",
      icon: Wallet,
      label: "Manage Balances",
    },
    {
      href: "/categories",
      icon: Activity,
      label: "Manage Categories",
    },
    {
      href: "/balances",
      icon: Plus,
      label: "Add Transaction",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button variant="outline" className="w-full justify-start">
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
