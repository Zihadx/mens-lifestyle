import type { Metadata } from "next";
import { ProductDiscovery } from "@/features/product/components/product-discovery";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest additions to the ZYQO collection.",
};

export default function NewArrivalsPage() {
  return (
    <ProductDiscovery
      title="New Arrivals"
      description="Fresh cuts and fabrics, added weekly."
      collection="new-arrivals"
    />
  );
}
