import type { Metadata } from "next";
import { ProductDiscovery } from "@/features/product/components/product-discovery";

export const metadata: Metadata = {
  title: "Offers",
  description: "Discounted pieces from the current VERO collection.",
};

export default function OffersPage() {
  return <ProductDiscovery title="Offers" description="Limited-time discounts across the collection." collection="offers" />;
}
