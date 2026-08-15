"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  Printer,
  Send,
  Copy,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  Receipt,
  Package,
  NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { CourierInfoCard } from "@/components/shared/courier-info-card";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import {
  useOrder,
  useUpdateOrderStatus,
  useCancelOrder,
} from "@/features/order/hooks/use-orders";
import {
  ORDER_STATUS_FLOW,
  getOrderStatusLabel,
  isOrderCancellable,
  type OrderStatus,
} from "@/lib/business-logic";
import { formatBDT, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/constants";

// Replace with your real business identity — used only in the printed invoice.
const STORE_INFO = {
  name: "ZYQO Store",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1209",
  phone: "+880 1XXX-XXXXXX",
  email: "hello@ZYQOstore.com",
};

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();
  const [internalNotes, setInternalNotes] = useState("");

  if (isLoading) return <PageSkeleton />;
  if (isError || !order)
    return <ErrorState title="Order not found" onRetry={() => refetch()} />;

  // Narrowed once — every helper below reads from this instead of re-asserting `order!`.
  const currentOrder = order;

  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentOrder.status);
  const nextStatus =
    currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1
      ? ORDER_STATUS_FLOW[currentIndex + 1]
      : null;

  function advanceStatus() {
    if (!nextStatus) return;
    updateStatus.mutate(
      { id: currentOrder.id, status: nextStatus },
      {
        onSuccess: () =>
          toast.success(
            `Order marked as ${getOrderStatusLabel(nextStatus).toLowerCase()}`,
          ),
      },
    );
  }

  function setStatus(status: OrderStatus) {
    updateStatus.mutate(
      { id: currentOrder.id, status },
      {
        onSuccess: () =>
          toast.success(`Status updated to ${getOrderStatusLabel(status)}`),
      },
    );
  }

  function copyTrackingId() {
    if (!currentOrder.trackingId) return;
    navigator.clipboard.writeText(currentOrder.trackingId);
    toast.success("Tracking ID copied");
  }

  const itemCount = currentOrder.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const printedOn = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          /* Defensive net: hides any app chrome (topbar/sidebar) that wraps this
             page but isn't marked print:hidden itself. Safe to remove once the
             layout's own navbar/sidebar carries print:hidden directly. */
          header:not([data-invoice]),
          nav,
          [data-topbar],
          [data-app-sidebar] {
            display: none !important;
          }
        }
      `}</style>

      {/* ============================================================
          PRINT-ONLY INVOICE
      ============================================================ */}
      <section data-invoice className="hidden print:block print:text-black">
        <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-3">
          <div>
            <h1 className="text-lg font-bold">{STORE_INFO.name}</h1>
            <p className="text-[11px] leading-4 text-neutral-600">
              {STORE_INFO.address}
            </p>
            <p className="text-[11px] leading-4 text-neutral-600">
              {STORE_INFO.phone} · {STORE_INFO.email}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Invoice
            </h2>
            <p className="text-[11px] leading-4">
              Invoice No:{" "}
              <span className="font-medium">{currentOrder.orderNumber}</span>
            </p>
            <p className="text-[11px] leading-4">
              Order Date:{" "}
              {formatDate(currentOrder.createdAt, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-[11px] leading-4">Printed: {printedOn}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-6 text-[11px] leading-4">
          <div>
            <p className="mb-1 font-semibold uppercase tracking-wide text-neutral-500">
              Bill To
            </p>
            <p className="font-medium">{currentOrder.customerName}</p>
            <p>{currentOrder.customerPhone}</p>
            <p className="mt-1">
              {currentOrder.address.addressLine}
              <br />
              {currentOrder.address.area}, {currentOrder.address.district}
            </p>
          </div>
          <div>
            <p className="mb-1 font-semibold uppercase tracking-wide text-neutral-500">
              Payment
            </p>
            <p>Method: {PAYMENT_METHOD_LABELS[currentOrder.paymentMethod]}</p>
            <p>Status: {currentOrder.paymentStatus}</p>
            <p className="mt-1">
              Order Status: {getOrderStatusLabel(currentOrder.status)}
            </p>
            {currentOrder.trackingId && (
              <p>
                Tracking: {currentOrder.courierProvider} ·{" "}
                {currentOrder.trackingId}
              </p>
            )}
          </div>
        </div>

        <table className="mt-4 w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-neutral-900 text-left uppercase tracking-wide text-neutral-500">
              <th className="py-1.5 font-semibold">Item</th>
              <th className="py-1.5 font-semibold">Variant</th>
              <th className="py-1.5 text-right font-semibold">Qty</th>
              <th className="py-1.5 text-right font-semibold">Unit Price</th>
              <th className="py-1.5 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder.items.map((item, i) => (
              <tr
                key={i}
                className="border-b border-neutral-200 break-inside-avoid"
              >
                <td className="py-1.5 pr-2">{item.name}</td>
                <td className="py-1.5 pr-2 text-neutral-600">
                  {item.color} · {item.size}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatBDT(item.price)}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatBDT(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-3 w-56 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-neutral-600">
              Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
            </span>
            <span className="tabular-nums">
              {formatBDT(currentOrder.subtotal)}
            </span>
          </div>
          {currentOrder.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">
                Discount{" "}
                {currentOrder.couponCode && `(${currentOrder.couponCode})`}
              </span>
              <span className="tabular-nums">
                −{formatBDT(currentOrder.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-600">Delivery</span>
            <span className="tabular-nums">
              {formatBDT(currentOrder.deliveryCharge)}
            </span>
          </div>
          <div className="flex justify-between border-t-2 border-neutral-900 pt-1 text-sm font-bold">
            <span>Total</span>
            <span className="tabular-nums">
              {formatBDT(currentOrder.total)}
            </span>
          </div>
        </div>

        <p className="mt-6 border-t border-neutral-200 pt-2 text-center text-[10px] text-neutral-500">
          Thank you for your order. For questions about this invoice, contact{" "}
          {STORE_INFO.email}.
        </p>
      </section>

      {/* ============================================================
          SCREEN UI — responsive, hidden on print
      ============================================================ */}
      <main className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden print:hidden sm:space-y-5 lg:space-y-6">
        {/* Back */}
        <Link
          href="/admin/orders"
          className="inline-flex max-w-full items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5 shrink-0" />
          Back to Orders
        </Link>

        {/* Header */}
        <header className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <Receipt className="size-4 shrink-0 text-muted-foreground" />
              <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                #{currentOrder.orderNumber}
              </h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Placed{" "}
              {formatDate(currentOrder.createdAt, {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · {itemCount} item
              {itemCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <OrderStatusBadge status={currentOrder.status} />
              <PaymentStatusBadge status={currentOrder.paymentStatus} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="w-full sm:w-auto"
            >
              <Printer className="size-3.5" />
              Print Invoice
            </Button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Status */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex shrink-0 items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Send className="size-3.5" />
                  Status
                </h2>
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                  <Select
                    value={currentOrder.status}
                    onValueChange={(v) => setStatus(v as OrderStatus)}
                  >
                    <SelectTrigger className="h-9 w-full text-xs sm:w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS_FLOW.concat([
                        "cancelled",
                        "failed-delivery",
                        "returned",
                        "refunded",
                      ]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {getOrderStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {nextStatus && (
                    <Button
                      size="sm"
                      onClick={advanceStatus}
                      loading={updateStatus.isPending}
                      className="w-full sm:w-auto"
                    >
                      <Send className="size-3.5" />
                      Mark {getOrderStatusLabel(nextStatus)}
                    </Button>
                  )}
                </div>
              </div>
              <div className="min-w-0 overflow-x-auto overscroll-x-contain">
                <OrderStatusTimeline
                  currentStatus={currentOrder.status}
                  events={currentOrder.timeline}
                />
              </div>
            </section>

            {/* Courier */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <Truck className="size-3.5" />
                  Courier
                </h2>
                {currentOrder.trackingId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground"
                    onClick={copyTrackingId}
                  >
                    <Copy className="size-3" />
                    Copy ID
                  </Button>
                )}
              </div>
              <div className="min-w-0">
                <CourierInfoCard
                  provider={currentOrder.courierProvider}
                  trackingId={currentOrder.trackingId}
                  trackingUrl={currentOrder.trackingUrl}
                />
              </div>
            </section>

            {/* Items */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <h2 className="mb-4 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Package className="size-3.5" />
                Items ({itemCount})
              </h2>

              <div className="space-y-4">
                {currentOrder.items.map((item, i) => (
                  <div key={i} className="flex min-w-0 items-start gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary sm:size-14">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="mt-0.5 wrap-break-word text-xs text-muted-foreground">
                        {item.color} · {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-right text-sm font-medium tabular-nums">
                      {formatBDT(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="shrink-0 tabular-nums">
                    {formatBDT(currentOrder.subtotal)}
                  </span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex items-center justify-between gap-4 text-success">
                    <span className="min-w-0 truncate">
                      Discount{" "}
                      {currentOrder.couponCode &&
                        `(${currentOrder.couponCode})`}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      −{formatBDT(currentOrder.discount)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="shrink-0 tabular-nums">
                    {formatBDT(currentOrder.deliveryCharge)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4 text-base font-semibold">
                  <span>Total</span>
                  <span className="shrink-0 tabular-nums">
                    {formatBDT(currentOrder.total)}
                  </span>
                </div>
              </div>
            </section>

            {/* Internal Notes */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <NotebookPen className="size-3.5" />
                Internal Notes
              </h2>
              <Textarea
                placeholder="Notes visible to staff only (not shown to the customer)..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="min-h-24 w-full resize-y"
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full sm:w-auto"
                onClick={() => toast.success("Note saved")}
                disabled={!internalNotes.trim()}
              >
                Save Note
              </Button>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
            <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <User className="size-3.5" />
                Customer
              </h2>
              <p className="truncate text-sm font-medium">
                {currentOrder.customerName}
              </p>
              <p className="mt-1 flex items-center gap-1.5 break-all text-sm text-muted-foreground">
                <Phone className="size-3.5 shrink-0" />
                {currentOrder.customerPhone}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                asChild
              >
                <Link href="/admin/customers">View Customer Profile</Link>
              </Button>
            </section>

            <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <MapPin className="size-3.5" />
                Delivery Address
              </h2>
              <p className="wrap-break-word text-sm leading-6 text-muted-foreground">
                {currentOrder.address.addressLine}
                <br />
                {currentOrder.address.area}, {currentOrder.address.district}
              </p>
            </section>

            <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <CreditCard className="size-3.5" />
                Payment
              </h2>
              <p className="wrap-break-word text-sm font-medium">
                {PAYMENT_METHOD_LABELS[currentOrder.paymentMethod]}
              </p>
              <div className="mt-2">
                <PaymentStatusBadge status={currentOrder.paymentStatus} />
              </div>
            </section>

            {isOrderCancellable(currentOrder.status) && (
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={() =>
                  cancelOrder.mutate(
                    { id: currentOrder.id, reason: "Cancelled by admin" },
                    { onSuccess: () => toast.success("Order cancelled") },
                  )
                }
                loading={cancelOrder.isPending}
              >
                Cancel Order
              </Button>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
