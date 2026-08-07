/**
 * Centralized business logic.
 * UI components must call these helpers rather than embedding rules
 * like `if (stock > 5)` directly — keeps behavior consistent and makes
 * the eventual backend swap (stock/pricing rules move server-side) painless.
 */

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(availableQty: number): StockStatus {
  if (availableQty <= 0) return "out-of-stock";
  if (availableQty <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function getStockStatusLabel(status: StockStatus): string {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Only a few left";
    case "out-of-stock":
      return "Out of Stock";
  }
}

export function calculateDiscountPercent(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export interface OrderTotalInput {
  subtotal: number;
  discount?: number;
  deliveryCharge?: number;
}

export function calculateOrderTotal({ subtotal, discount = 0, deliveryCharge = 0 }: OrderTotalInput): number {
  return Math.max(0, subtotal - discount) + deliveryCharge;
}

export type DeliveryZone = "inside-dhaka" | "outside-dhaka";

const DELIVERY_CHARGES: Record<DeliveryZone, number> = {
  "inside-dhaka": 70,
  "outside-dhaka": 130,
};

const FREE_DELIVERY_THRESHOLD = 2500;

export function getDeliveryCharge(zone: DeliveryZone, subtotal: number): number {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_CHARGES[zone];
}

export function getDeliveryEstimate(zone: DeliveryZone): string {
  return zone === "inside-dhaka" ? "1–2 business days" : "3–5 business days";
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "picked-up"
  | "in-transit"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "failed-delivery"
  | "returned"
  | "refunded";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  "picked-up": "Picked Up by Courier",
  "in-transit": "In Transit",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  "failed-delivery": "Failed Delivery",
  returned: "Returned",
  refunded: "Refunded",
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "picked-up",
  "in-transit",
  "out-for-delivery",
  "delivered",
];

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cod-pending" | "cod-collected";

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: "Payment Pending",
    paid: "Paid",
    failed: "Payment Failed",
    refunded: "Refunded",
    "cod-pending": "COD — Awaiting Collection",
    "cod-collected": "COD Collected",
  };
  return labels[status];
}

export function isOrderCancellable(status: OrderStatus): boolean {
  return status === "pending" || status === "confirmed" || status === "processing";
}
