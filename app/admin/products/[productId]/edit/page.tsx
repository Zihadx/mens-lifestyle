"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/features/product/components/product-form";
import { useProductById } from "@/features/product/hooks/use-products";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";

export default function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const { data: product, isLoading, isError, refetch } = useProductById(productId);

  if (isLoading) return <PageSkeleton />;
  if (isError || !product) return <ErrorState title="Product not found" onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3.5" /> Back to Products
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
