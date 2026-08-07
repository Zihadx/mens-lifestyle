import { productService, type ProductQuery } from "@/features/product/services/product.service";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/shared/product-card";

interface ProductCollectionSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  query: ProductQuery;
  viewAllHref: string;
  className?: string;
}

export async function ProductCollectionSection({
  eyebrow,
  title,
  description,
  query,
  viewAllHref,
  className,
}: ProductCollectionSectionProps) {
  const { items } = await productService.list({ ...query, pageSize: query.pageSize ?? 4 });

  if (items.length === 0) return null;

  return (
    <section className={`container py-14 sm:py-20 ${className ?? ""}`}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} viewAllHref={viewAllHref} className="mb-8" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
