import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton } from "@/components/ui/skeleton-cards";

export const DashboardLoading: React.FC = () => {
  return (
    <div className="w-full space-y-8">
      {/* Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions and Balances Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Balances */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border">
              <div className="space-y-2">
                <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
