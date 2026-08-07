import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryGridSection } from "@/components/home/category-grid-section";
import { ProductCollectionSection } from "@/components/home/product-collection-section";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { TrustSection } from "@/components/home/trust-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { InstagramSection } from "@/components/home/instagram-section";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <CategoryGridSection />

      <ProductCollectionSection
        eyebrow="Just landed"
        title="New Arrivals"
        description="Fresh cuts and fabrics, added weekly."
        query={{ collection: "new-arrivals", sort: "newest" }}
        viewAllHref="/shop/new-arrivals"
      />

      <FlashSaleSection />

      <ProductCollectionSection
        eyebrow="Customer favorites"
        title="Best Sellers"
        description="The pieces people keep coming back for."
        query={{ collection: "best-sellers", sort: "popularity" }}
        viewAllHref="/shop/best-sellers"
        className="bg-secondary/20"
      />

      <TestimonialsSection />
      <InstagramSection />
    </>
  );
}
