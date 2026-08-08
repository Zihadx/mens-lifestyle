"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatBDT, formatDate } from "@/lib/utils";
import type { Order } from "@/types/order";

export const orderColumns: ColumnDef<Order, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />
    ),
  },
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
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.original.customerName}</p>
        <p className="text-xs text-muted-foreground">{row.original.customerPhone}</p>
      </div>
    ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.items.length}</span>,
  },
  {
    accessorKey: "total",
    header: "Amount",
    cell: ({ row }) => <span className="font-medium">{formatBDT(row.original.total)}</span>,
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "courierProvider",
    header: "Courier",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.courierProvider ?? "—"}</span>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/orders/${row.original.id}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`tel:${row.original.customerPhone}`}>Call Customer</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
