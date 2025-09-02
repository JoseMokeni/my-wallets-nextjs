import { Skeleton } from "@/components/ui/skeleton";

export const BalanceCardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    </div>
  );
};

export const BalancesGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <BalanceCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DataTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/8" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PageHeaderSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 p-6 border">
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-purple/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full transform -translate-x-12 translate-y-12" />
    </div>
  );
};