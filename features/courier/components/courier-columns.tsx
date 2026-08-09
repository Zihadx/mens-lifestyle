"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBDT, formatDate } from "@/lib/utils";
import type { CourierShipment, CourierStatus } from "@/types/misc";

const STATUS_LABEL: Record<CourierStatus, string> = {
  "pending-pickup": "Pending Pickup",
  "picked-up": "Picked Up",
  "in-transit": "In Transit",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
  returned: "Returned",
};

const STATUS_VARIANT: Record<CourierStatus, "muted" | "accent" | "warning" | "success" | "destructive"> = {
  "pending-pickup": "muted",
  "picked-up": "accent",
  "in-transit": "accent",
  "out-for-delivery": "warning",
  delivered: "success",
  failed: "destructive",
  returned: "destructive",
};

export const courierColumns: ColumnDef<CourierShipment, any>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => (
      <Link href={`/admin/orders/${row.original.orderId}`} className="font-medium hover:underline">
        #{row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: "provider",
    header: "Courier",
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.original.provider}</p>
        <p className="text-xs text-muted-foreground">{row.original.trackingId}</p>
      </div>
    ),
  },
  {
    accessorKey: "deliveryAddress",
    header: "Destination",
    cell: ({ row }) => <span className="line-clamp-1 text-sm text-muted-foreground">{row.original.deliveryAddress}</span>,
  },
  {
    accessorKey: "codAmount",
    header: "COD Amount",
    cell: ({ row }) => <span className="text-sm">{row.original.codAmount > 0 ? formatBDT(row.original.codAmount) : "—"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{STATUS_LABEL[row.original.status]}</Badge>,
  },
  {
    accessorKey: "estimatedDelivery",
    header: "Est. Delivery",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.estimatedDelivery)}</span>,
  },
  {
    id: "track",
    header: "",
    cell: ({ row }) => (
      <a
        href={row.original.trackingUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
      >
        Track <ExternalLink className="size-3" />
      </a>
    ),
  },
];
