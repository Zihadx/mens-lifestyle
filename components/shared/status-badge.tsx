import { Badge } from "@/components/ui/badge";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/business-logic";

const ORDER_STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "accent" | "success" | "warning" | "destructive" | "muted"> = {
  pending: "muted",
  confirmed: "secondary",
  processing: "accent",
  packed: "accent",
  "picked-up": "accent",
  "in-transit": "accent",
  "out-for-delivery": "warning",
  delivered: "success",
  cancelled: "destructive",
  "failed-delivery": "destructive",
  returned: "destructive",
  refunded: "muted",
};

const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, "default" | "secondary" | "accent" | "success" | "warning" | "destructive" | "muted"> = {
  pending: "muted",
  paid: "success",
  failed: "destructive",
  refunded: "muted",
  "cod-pending": "warning",
  "cod-collected": "success",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={ORDER_STATUS_VARIANT[status]}>{getOrderStatusLabel(status)}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={PAYMENT_STATUS_VARIANT[status]}>{getPaymentStatusLabel(status)}</Badge>;
}
