import { productService } from "@/features/product/services/product.service";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/shared/product-card";

export async function CartRecommendations() {
  const { items } = await productService.list({ collection: "best-sellers", pageSize: 4 });
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <SectionHeading eyebrow="You might also like" title="Complete Your Order" className="mb-6" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
