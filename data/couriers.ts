import type { CourierShipment, CourierStatus } from "@/types/misc";
import { orders } from "@/data/orders";
import type { OrderStatus } from "@/lib/business-logic";

const ORDER_TO_COURIER_STATUS: Partial<Record<OrderStatus, CourierStatus>> = {
  packed: "pending-pickup",
  "picked-up": "picked-up",
  "in-transit": "in-transit",
  "out-for-delivery": "out-for-delivery",
  delivered: "delivered",
  "failed-delivery": "failed",
  returned: "returned",
};

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export const courierShipments: CourierShipment[] = orders
  .filter((o) => o.courierProvider && o.trackingId)
  .map((o, i) => ({
    id: `ship_${String(i + 1).padStart(4, "0")}`,
    orderId: o.id,
    orderNumber: o.orderNumber,
    provider: o.courierProvider!,
    trackingId: o.trackingId!,
    trackingUrl: `https://track.example-courier.com/${o.trackingId}`,
    status: ORDER_TO_COURIER_STATUS[o.status] ?? "pending-pickup",
    pickupAddress: "VERO Warehouse, Tejgaon Industrial Area, Dhaka",
    deliveryAddress: `${o.address.addressLine}, ${o.address.area}, ${o.address.district}`,
    codAmount: o.paymentMethod === "cod" ? o.total : 0,
    deliveryCharge: o.deliveryCharge,
    estimatedDelivery: daysFromNow(o.address.zone === "inside-dhaka" ? 1 : 3),
    createdAt: o.createdAt,
  }));

export function getShipmentByOrderId(orderId: string): CourierShipment | undefined {
  return courierShipments.find((s) => s.orderId === orderId);
}
