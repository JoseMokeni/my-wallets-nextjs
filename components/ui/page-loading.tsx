import { Skeleton } from "@/components/ui/skeleton";

export const AuthPageLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="text-center">
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export const SimplePageLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-brand-blue rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-brand-purple rounded-full animate-pulse animation-delay-150"></div>
        <div className="w-4 h-4 bg-brand-teal rounded-full animate-pulse animation-delay-300"></div>
      </div>
    </div>
  );
};