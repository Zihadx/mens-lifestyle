import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { productService } from "@/features/product/services/product.service";
import { getCategoryBySlug } from "@/data/categories";
import { ProductGallery } from "@/features/product/components/product-gallery";
import { PurchasePanel } from "@/features/product/components/purchase-panel";
import { ProductInfoAccordion } from "@/features/product/components/product-info-accordion";
import { ReviewsSection } from "@/features/product/components/reviews-section";
import { RelatedProductsSection } from "@/features/product/components/related-products-section";
import { RecentlyViewedSection } from "@/features/product/components/recently-viewed-section";
import { TrackProductView } from "@/features/product/components/track-product-view";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) return {};

  return {
    title: product.seo.title,
    description: product.seo.description,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      images: product.images.map((img) => ({ url: img.url })),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: siteConfig.currency,
      price: product.price,
      availability: product.variants.some((v) => v.stock - v.reservedStock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.rating.count > 0
      ? { "@type": "AggregateRating", ratingValue: product.rating.average, reviewCount: product.rating.count }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.url}/shop` },
      category && { "@type": "ListItem", position: 3, name: category.name, item: `${siteConfig.url}/shop/category/${category.slug}` },
      { "@type": "ListItem", position: 4, name: product.name, item: `${siteConfig.url}/products/${product.slug}` },
    ].filter(Boolean),
  };

  return (
    <div className="container py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TrackProductView product={product} />

      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        {category && (
          <>
            <ChevronRight className="size-3" />
            <Link href={`/shop/category/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />
        <PurchasePanel product={product} />
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <ProductInfoAccordion product={product} />
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <ReviewsSection productId={product.id} ratingAverage={product.rating.average} ratingCount={product.rating.count} />
      </div>

      <div className="mt-16 space-y-16">
        <RelatedProductsSection productId={product.id} />
        <RecentlyViewedSection excludeProductId={product.id} />
      </div>
    </div>
  );
}
