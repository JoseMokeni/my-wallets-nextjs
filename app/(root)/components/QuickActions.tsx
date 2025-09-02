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
      variant: "brand-blue" as const,
    },
    {
      href: "/categories",
      icon: Activity,
      label: "Manage Categories",
      variant: "brand-teal" as const,
    },
    {
      href: "/balances",
      icon: Plus,
      label: "Add Transaction",
      variant: "brand-purple" as const,
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
              <Button variant={action.variant} className="w-full justify-start h-12">
                <action.icon className="w-5 h-5 mr-3" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
