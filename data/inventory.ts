import type { StockActivity } from "@/types/misc";
import { products } from "@/data/products";

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

interface Seed {
  productIndex: number;
  type: StockActivity["type"];
  quantityChange: number;
  reason: string;
  hoursAgo: number;
}

const SEEDS: Seed[] = [
  { productIndex: 0, type: "reserved", quantityChange: -1, reason: "Order VR100001 placed", hoursAgo: 2 },
  { productIndex: 0, type: "reduced", quantityChange: -1, reason: "Order VR100001 confirmed", hoursAgo: 1.5 },
  { productIndex: 6, type: "restocked", quantityChange: 40, reason: "New shipment received from supplier", hoursAgo: 30 },
  { productIndex: 3, type: "reserved", quantityChange: -2, reason: "Order VR100004 placed", hoursAgo: 5 },
  { productIndex: 10, type: "restored", quantityChange: 1, reason: "Order VR100006 cancelled", hoursAgo: 48 },
  { productIndex: 13, type: "adjusted", quantityChange: -1, reason: "Damaged unit removed from inventory", hoursAgo: 72 },
  { productIndex: 8, type: "reduced", quantityChange: -1, reason: "Order VR100009 confirmed", hoursAgo: 12 },
  { productIndex: 6, type: "reduced", quantityChange: -3, reason: "Order VR100010 confirmed", hoursAgo: 60 },
];

export const stockActivity: StockActivity[] = SEEDS.map((s, i) => {
  const product = products[s.productIndex]!;
  return {
    id: `stk_${String(i + 1).padStart(4, "0")}`,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    type: s.type,
    quantityChange: s.quantityChange,
    reason: s.reason,
    createdAt: hoursAgo(s.hoursAgo),
  };
});
