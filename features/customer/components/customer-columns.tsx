"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatBDT, formatDate } from "@/lib/utils";
import type { Customer } from "@/types/customer";

const RISK_VARIANT: Record<Customer["riskLevel"], "success" | "muted" | "warning"> = {
  trusted: "success",
  normal: "muted",
  watch: "warning",
};

export const customerColumns: ColumnDef<Customer, any>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => {
      const initials = row.original.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
      return (
        <Link href={`/admin/customers/${row.original.id}`} className="flex items-center gap-3 hover:underline">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.phone}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "totalOrders",
    header: "Orders",
    cell: ({ row }) => <span className="text-sm">{row.original.totalOrders}</span>,
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => <span className="font-medium">{formatBDT(row.original.totalSpent)}</span>,
  },
  {
    accessorKey: "averageOrderValue",
    header: "AOV",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatBDT(row.original.averageOrderValue)}</span>,
  },
  {
    accessorKey: "codSuccessRate",
    header: "COD Success",
    cell: ({ row }) => <span className="text-sm">{row.original.codSuccessRate}%</span>,
  },
  {
    accessorKey: "lastOrderAt",
    header: "Last Order",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.lastOrderAt ? formatDate(row.original.lastOrderAt) : "—"}</span>
    ),
  },
  {
    accessorKey: "riskLevel",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={RISK_VARIANT[row.original.riskLevel]} className="capitalize">
        {row.original.riskLevel}
      </Badge>
    ),
  },
];
