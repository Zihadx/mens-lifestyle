"use client";

import { useRelatedProducts } from "@/features/product/hooks/use-products";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGridSkeleton } from "@/components/shared/skeletons";

export function RelatedProductsSection({ productId }: { productId: string }) {
  const { data, isLoading } = useRelatedProducts(productId);

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section>
      <SectionHeading eyebrow="You might also like" title="Complete the Look" className="mb-6" />
      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {data!.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
