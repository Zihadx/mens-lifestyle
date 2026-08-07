import type { Metadata } from "next";
import { ProductDiscovery } from "@/features/product/components/product-discovery";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full VERO collection — shirts, panjabi, trousers, jackets, and more.",
};

export default function ShopPage() {
  return <ProductDiscovery title="Shop All" description="Every piece in the current collection." />;
}
