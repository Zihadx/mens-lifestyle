import { ProductGridSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container py-10">
      <Skeleton className="mb-2 h-8 w-64" />
      <Skeleton className="mb-8 h-4 w-96" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden space-y-4 lg:block">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
