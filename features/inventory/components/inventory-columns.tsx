"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStockStatusLabel } from "@/lib/business-logic";
import type { InventoryRow } from "@/features/inventory/services/inventory.service";

const STATUS_VARIANT = {
  "in-stock": "success",
  "low-stock": "warning",
  "out-of-stock": "destructive",
} as const;

export function buildInventoryColumns(onAdjust: (productId: string) => void): ColumnDef<InventoryRow, any>[] {
  return [
    {
      accessorKey: "productName",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
            <Image src={row.original.image} alt={row.original.productName} fill sizes="40px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.productName}</p>
            <p className="text-xs text-muted-foreground">{row.original.sku}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalStock",
      header: "Total Stock",
      cell: ({ row }) => <span className="text-sm">{row.original.totalStock}</span>,
    },
    {
      accessorKey: "reservedStock",
      header: "Reserved",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.reservedStock}</span>,
    },
    {
      accessorKey: "availableStock",
      header: "Available",
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.availableStock}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{getStockStatusLabel(row.original.status)}</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => onAdjust(row.original.productId)}>
          <Boxes className="size-3.5" /> Adjust
        </Button>
      ),
    },
  ];
}
