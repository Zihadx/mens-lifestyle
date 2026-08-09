"use client";

import { useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRefundOrder } from "@/features/order/hooks/use-orders";
import { formatBDT, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/constants";
import type { Order } from "@/types/order";

function RefundAction({ order }: { order: Order }) {
  const refundOrder = useRefundOrder();
  const [open, setOpen] = useState(false);
  const canRefund = order.paymentStatus === "paid" || order.paymentStatus === "cod-collected";

  if (!canRefund) return <span className="text-xs text-muted-foreground">—</span>;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Refund
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund order #{order.orderNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              This marks the payment as refunded. In production this would trigger the actual refund through the
              payment gateway or a manual bKash/Nagad/Rocket payout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                refundOrder.mutate(
                  { id: order.id, reason: "Refunded by admin" },
                  { onSuccess: () => { toast.success("Refund recorded"); setOpen(false); } }
                )
              }
            >
              Confirm Refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const paymentColumns: ColumnDef<Order, any>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => (
      <div>
        <Link href={`/admin/orders/${row.original.id}`} className="font-medium hover:underline">
          #{row.original.orderNumber}
        </Link>
        <p className="text-xs text-muted-foreground">{formatDate(row.original.createdAt)}</p>
      </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => <span className="text-sm">{row.original.customerName}</span>,
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => <span className="text-sm">{PAYMENT_METHOD_LABELS[row.original.paymentMethod]}</span>,
  },
  {
    accessorKey: "total",
    header: "Amount",
    cell: ({ row }) => <span className="font-medium">{formatBDT(row.original.total)}</span>,
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <RefundAction order={row.original} />,
  },
];
