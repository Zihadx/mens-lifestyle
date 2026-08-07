import type { Order, OrderTimelineEvent } from "@/types/order";
import type { OrderStatus, PaymentStatus } from "@/lib/business-logic";
import { ORDER_STATUS_FLOW, getOrderStatusLabel, calculateOrderTotal, getDeliveryCharge } from "@/lib/business-logic";
import { products } from "@/data/products";
import { customers } from "@/data/customers";

function daysAgo(days: number, hours = 0): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000).toISOString();
}

function buildTimeline(finalStatus: OrderStatus, startDaysAgo: number): OrderTimelineEvent[] {
  const flowIndex = ORDER_STATUS_FLOW.indexOf(finalStatus);
  const relevantFlow = flowIndex >= 0 ? ORDER_STATUS_FLOW.slice(0, flowIndex + 1) : ["pending" as OrderStatus];
  return relevantFlow.map((status, i) => ({
    status,
    label: getOrderStatusLabel(status),
    timestamp: daysAgo(startDaysAgo - i * 0.6),
  }));
}

interface OrderSeed {
  customerIndex: number;
  productIndexes: number[];
  status: OrderStatus;
  paymentMethod: Order["paymentMethod"];
  paymentStatus: PaymentStatus;
  zone: "inside-dhaka" | "outside-dhaka";
  daysAgo: number;
}

const SEEDS: OrderSeed[] = [
  { customerIndex: 0, productIndexes: [0, 6], status: "delivered", paymentMethod: "cod", paymentStatus: "cod-collected", zone: "inside-dhaka", daysAgo: 12 },
  { customerIndex: 1, productIndexes: [3], status: "out-for-delivery", paymentMethod: "cod", paymentStatus: "cod-pending", zone: "inside-dhaka", daysAgo: 1 },
  { customerIndex: 2, productIndexes: [9], status: "failed-delivery", paymentMethod: "cod", paymentStatus: "cod-pending", zone: "outside-dhaka", daysAgo: 6 },
  { customerIndex: 3, productIndexes: [1, 8], status: "in-transit", paymentMethod: "bkash", paymentStatus: "paid", zone: "outside-dhaka", daysAgo: 2 },
  { customerIndex: 4, productIndexes: [13], status: "delivered", paymentMethod: "card", paymentStatus: "paid", zone: "inside-dhaka", daysAgo: 20 },
  { customerIndex: 5, productIndexes: [10], status: "cancelled", paymentMethod: "cod", paymentStatus: "pending", zone: "inside-dhaka", daysAgo: 15 },
  { customerIndex: 6, productIndexes: [6, 11], status: "processing", paymentMethod: "nagad", paymentStatus: "paid", zone: "outside-dhaka", daysAgo: 0.5 },
  { customerIndex: 7, productIndexes: [4], status: "packed", paymentMethod: "cod", paymentStatus: "pending", zone: "inside-dhaka", daysAgo: 0.3 },
  { customerIndex: 8, productIndexes: [2], status: "confirmed", paymentMethod: "cod", paymentStatus: "pending", zone: "inside-dhaka", daysAgo: 0.1 },
  { customerIndex: 9, productIndexes: [0, 3, 9], status: "delivered", paymentMethod: "bkash", paymentStatus: "paid", zone: "inside-dhaka", daysAgo: 25 },
  { customerIndex: 10, productIndexes: [6], status: "returned", paymentMethod: "cod", paymentStatus: "refunded", zone: "outside-dhaka", daysAgo: 30 },
  { customerIndex: 11, productIndexes: [12], status: "delivered", paymentMethod: "cod", paymentStatus: "cod-collected", zone: "inside-dhaka", daysAgo: 9 },
  { customerIndex: 0, productIndexes: [14], status: "pending", paymentMethod: "cod", paymentStatus: "pending", zone: "inside-dhaka", daysAgo: 0.02 },
  { customerIndex: 4, productIndexes: [7, 8], status: "picked-up", paymentMethod: "rocket", paymentStatus: "paid", zone: "inside-dhaka", daysAgo: 0.8 },
  { customerIndex: 3, productIndexes: [5], status: "delivered", paymentMethod: "cod", paymentStatus: "cod-collected", zone: "inside-dhaka", daysAgo: 40 },
];

const COURIERS = ["Pathao Courier", "Steadfast Courier", "RedX", "eCourier"];

export const orders: Order[] = SEEDS.map((seed, i) => {
  const id = `ord_${String(i + 1).padStart(4, "0")}`;
  const customer = customers[seed.customerIndex]!;
  const items = seed.productIndexes.map((pIdx) => {
    const p = products[pIdx]!;
    const variant = p.variants[0]!;
    const quantity = 1 + Math.floor(Math.random() * 2);
    return {
      productId: p.id,
      variantId: variant.id,
      name: p.name,
      image: p.images[0]?.url ?? "",
      size: variant.size,
      color: variant.color.name,
      price: p.price,
      quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const deliveryCharge = getDeliveryCharge(seed.zone, subtotal);
  const total = calculateOrderTotal({ subtotal, discount, deliveryCharge });
  const isTerminal = ["delivered", "cancelled", "returned", "failed-delivery"].includes(seed.status);
  const courier = COURIERS[i % COURIERS.length]!;

  return {
    id,
    orderNumber: `VR${String(100000 + i)}`,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    items,
    subtotal,
    discount,
    deliveryCharge,
    total,
    address: {
      fullName: customer.name,
      phone: customer.phone,
      district: customer.addresses[0]!.district,
      area: customer.addresses[0]!.area,
      addressLine: customer.addresses[0]!.addressLine,
      zone: seed.zone,
    },
    paymentMethod: seed.paymentMethod,
    paymentStatus: seed.paymentStatus,
    status: seed.status,
    timeline: buildTimeline(seed.status, seed.daysAgo),
    courierProvider: seed.status === "pending" || seed.status === "confirmed" ? undefined : courier,
    trackingId: seed.status === "pending" || seed.status === "confirmed" ? undefined : `${courier.slice(0, 2).toUpperCase()}${100000 + i}BD`,
    trackingUrl: undefined,
    createdAt: daysAgo(seed.daysAgo),
    updatedAt: daysAgo(isTerminal ? seed.daysAgo - 2 : seed.daysAgo * 0.3),
  };
});

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return orders.filter((o) => o.customerId === customerId);
}
