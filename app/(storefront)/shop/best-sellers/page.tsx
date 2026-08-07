import type { Metadata } from "next";
import { ProductDiscovery } from "@/features/product/components/product-discovery";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "The pieces our customers keep coming back for.",
};

export default function BestSellersPage() {
  return <ProductDiscovery title="Best Sellers" description="Customer favorites, restocked regularly." collection="best-sellers" />;
}
