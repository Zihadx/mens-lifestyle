"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { formatBDT, formatDate } from "@/lib/utils";
import type { Coupon } from "@/types/misc";

const TYPE_LABEL: Record<Coupon["type"], string> = {
  percentage: "Percentage",
  fixed: "Fixed Amount",
  "free-delivery": "Free Delivery",
};

interface Callbacks {
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
  onToggle: (id: string) => void;
}

export function buildCouponColumns({ onEdit, onDelete, onToggle }: Callbacks): ColumnDef<Coupon, any>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.code}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{TYPE_LABEL[row.original.type]}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.type === "percentage" && `${row.original.value}% off`}
            {row.original.type === "fixed" && formatBDT(row.original.value)}
            {row.original.type === "free-delivery" && "Waives delivery charge"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "usageCount",
      header: "Usage",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.usageCount}
          {row.original.usageLimit ? ` / ${row.original.usageLimit}` : ""}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.expiresAt)}</span>,
    },
    {
      id: "firstOrder",
      header: "First Order Only",
      cell: ({ row }) => (row.original.isFirstOrderOnly ? <Badge variant="secondary">Yes</Badge> : <span className="text-muted-foreground">—</span>),
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => <Switch checked={row.original.isActive} onCheckedChange={() => onToggle(row.original.id)} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(row.original)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onDelete(row.original)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}
