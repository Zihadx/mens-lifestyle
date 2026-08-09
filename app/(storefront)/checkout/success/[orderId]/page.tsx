"use client";

import { use, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { useOrder } from "@/features/order/hooks/use-orders";
import { getDeliveryEstimate } from "@/lib/business-logic";
import { formatBDT, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/constants";
import { trackEvent } from "@/lib/analytics/track";

export default function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const hasTrackedPurchase = useRef(false);

  useEffect(() => {
    if (order && !hasTrackedPurchase.current) {
      hasTrackedPurchase.current = true;
      trackEvent("Purchase", {
        value: order.total,
        orderId: order.id,
        contentIds: order.items.map((i) => i.productId),
        numItems: order.items.reduce((sum, i) => sum + i.quantity, 0),
      });
    }
  }, [order]);

  if (isLoading) return <PageSkeleton />;
  if (isError || !order) {
    return (
      <div className="container py-16">
        <ErrorState title="We couldn't find that order" description="It may have expired — mock orders only persist for this browser session." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="size-8 text-success" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-medium tracking-tight">Order Confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks, {order.customerName.split(" ")[0]} — we've received your order and will confirm it shortly.
        </p>
        <p className="mt-1 text-sm font-medium">
          Order <span className="text-accent">#{order.orderNumber}</span>
        </p>
      </div>

      <div className="mt-10 space-y-6 rounded-lg border border-border p-6">
        <div className="space-y-3">
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

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatBDT(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
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
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="flex gap-2.5">
            <Wallet className="size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>
          <div className="flex gap-2.5">
            <Truck className="size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-muted-foreground">{getDeliveryEstimate(order.address.zone)}</p>
            </div>
          </div>
          <div className="flex gap-2.5 sm:col-span-2">
            <Package className="size-4 shrink-0 text-accent" />
            <div>
              <p className="font-medium">Delivering to</p>
              <p className="text-muted-foreground">
                {order.address.fullName} · {order.address.phone}
                <br />
                {order.address.addressLine}, {order.address.area}, {order.address.district}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">Placed on {formatDate(order.createdAt, { hour: "2-digit", minute: "2-digit" })}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild size="lg" className="flex-1">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="flex-1">
          <Link href={`/account/orders/${order.id}`}>Track Order</Link>
        </Button>
      </div>
    </div>
  );
}
