"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { CourierInfoCard } from "@/components/shared/courier-info-card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { useOrder, useCancelOrder } from "@/features/order/hooks/use-orders";
import { isOrderCancellable, getDeliveryEstimate } from "@/lib/business-logic";
import { formatBDT, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/constants";
import { siteConfig } from "@/config/site";

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const cancelOrder = useCancelOrder();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  if (isLoading) return <PageSkeleton />;
  if (isError || !order) {
    return (
      <div className="container py-16">
        <ErrorState title="We couldn't find that order" onRetry={() => refetch()} />
      </div>
    );
  }

  function handleCancel() {
    cancelOrder.mutate(
      { id: order!.id, reason: "Cancelled by customer" },
      {
        onSuccess: () => {
          toast.success("Order cancelled");
          setCancelDialogOpen(false);
        },
        onError: () => toast.error("Couldn't cancel this order"),
      }
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <Link href="/account/orders" className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3.5" /> Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="rounded-lg border border-border p-5">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order Status</h2>
            <OrderStatusTimeline currentStatus={order.status} events={order.timeline} />
          </section>

          <section className="rounded-lg border border-border p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Courier</h2>
            <CourierInfoCard provider={order.courierProvider} trackingId={order.trackingId} trackingUrl={order.trackingUrl} />
          </section>

          <section className="rounded-lg border border-border p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
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
          </section>
        </div>

        <div className="h-fit space-y-5">
          <div className="space-y-3 rounded-lg border border-border p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatBDT(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>−{formatBDT(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{order.deliveryCharge === 0 ? "Free" : formatBDT(order.deliveryCharge)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatBDT(order.total)}</span>
            </div>
            <Separator />
            <div>
              <p className="font-medium">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
              <p className="text-xs text-muted-foreground">Estimated delivery: {getDeliveryEstimate(order.address.zone)}</p>
            </div>
            <div>
              <p className="font-medium">Delivering to</p>
              <p className="text-xs text-muted-foreground">
                {order.address.fullName} · {order.address.phone}
                <br />
                {order.address.addressLine}, {order.address.area}, {order.address.district}
              </p>
            </div>
          </div>

          {isOrderCancellable(order.status) && (
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This can't be undone. If you've already made an online payment, your refund will be processed
                    according to our return policy.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Order</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {cancelOrder.isPending ? "Cancelling…" : "Yes, Cancel Order"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button variant="ghost" className="w-full" asChild>
            <a href={`tel:${siteConfig.supportPhone}`}>
              <MessageCircle className="size-4" /> Need help? Contact support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
