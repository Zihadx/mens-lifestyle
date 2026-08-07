import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or search term.",
}: ProductGridProps) {
  if (isLoading) return <ProductGridSkeleton count={8} />;
  if (isError) return <ErrorState title="Couldn't load products" onRetry={onRetry} />;
  if (products.length === 0) return <EmptyState icon={PackageSearch} title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
