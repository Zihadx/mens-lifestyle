import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/features/product/services/product.service";
import { reviewService } from "@/features/review/services/review.service";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingBenefits } from "@/features/landing/components/landing-benefits";
import { LandingSocialProof } from "@/features/landing/components/landing-social-proof";
import { LandingDeliveryTrust } from "@/features/landing/components/landing-delivery-trust";
import { LandingFAQ } from "@/features/landing/components/landing-faq";
import { LandingOrderPanel } from "@/features/landing/components/landing-order-panel";
import { StickyMobileBuyBar } from "@/features/landing/components/sticky-mobile-buy-bar";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Order Now, Pay on Delivery`,
    description: product.shortDescription,
    // Landing pages are for paid traffic, not organic search — keep them out of the index.
    robots: { index: false, follow: false },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) notFound();

  const reviews = await reviewService.getByProductId(product.id);

  return (
    <>
      <LandingHero product={product} />
      <Separator />
      <LandingBenefits product={product} />
      <LandingSocialProof reviews={reviews} />
      <LandingDeliveryTrust />
      <LandingFAQ />
      <LandingOrderPanel product={product} />
      <StickyMobileBuyBar product={product} />
    </>
  );
}
