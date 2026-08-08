"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, Printer, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { CourierInfoCard } from "@/components/shared/courier-info-card";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { useOrder, useUpdateOrderStatus, useCancelOrder } from "@/features/order/hooks/use-orders";
import { ORDER_STATUS_FLOW, getOrderStatusLabel, isOrderCancellable, type OrderStatus } from "@/lib/business-logic";
import { formatBDT, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/constants";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();
  const [internalNotes, setInternalNotes] = useState("");

  if (isLoading) return <PageSkeleton />;
  if (isError || !order) return <ErrorState title="Order not found" onRetry={() => refetch()} />;

  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const nextStatus = currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[currentIndex + 1] : null;

  function advanceStatus() {
    if (!nextStatus) return;
    updateStatus.mutate(
      { id: order!.id, status: nextStatus },
      { onSuccess: () => toast.success(`Order marked as ${getOrderStatusLabel(nextStatus).toLowerCase()}`) }
    );
  }

  function setStatus(status: OrderStatus) {
    updateStatus.mutate(
      { id: order!.id, status },
      { onSuccess: () => toast.success(`Status updated to ${getOrderStatusLabel(status)}`) }
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3.5" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">#{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt, { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" /> Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Status</h2>
              <div className="flex gap-2">
                <Select value={order.status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                  <SelectTrigger className="h-8 w-44 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUS_FLOW.concat(["cancelled", "failed-delivery", "returned", "refunded"]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {getOrderStatusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {nextStatus && (
                  <Button size="sm" onClick={advanceStatus} loading={updateStatus.isPending}>
                    <Send className="size-3.5" /> Mark {getOrderStatusLabel(nextStatus)}
                  </Button>
                )}
              </div>
            </div>
            <OrderStatusTimeline currentStatus={order.status} events={order.timeline} />
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Courier</h2>
            <CourierInfoCard provider={order.courierProvider} trackingId={order.trackingId} trackingUrl={order.trackingUrl} />
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color} · {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatBDT(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBDT(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>−{formatBDT(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{formatBDT(order.deliveryCharge)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatBDT(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Internal Notes</h2>
            <Textarea
              placeholder="Notes visible to staff only (not shown to the customer)..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            />
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => toast.success("Note saved")}
              disabled={!internalNotes.trim()}
            >
              Save Note
            </Button>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Customer</h2>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
              <Link href={`/admin/customers`}>View Customer Profile</Link>
            </Button>
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Delivery Address</h2>
            <p className="text-sm text-muted-foreground">
              {order.address.addressLine}
              <br />
              {order.address.area}, {order.address.district}
            </p>
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment</h2>
            <p className="text-sm font-medium">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
            <PaymentStatusBadge status={order.paymentStatus} />
          </section>

          {isOrderCancellable(order.status) && (
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() =>
                cancelOrder.mutate(
                  { id: order.id, reason: "Cancelled by admin" },
                  { onSuccess: () => toast.success("Order cancelled") }
                )
              }
              loading={cancelOrder.isPending}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
