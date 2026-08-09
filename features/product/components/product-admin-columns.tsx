"use client";

import Image from "next/image";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStockStatus, getStockStatusLabel } from "@/lib/business-logic";
import { formatBDT } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types/product";

const STATUS_VARIANT: Record<ProductStatus, "success" | "muted" | "warning"> = {
  published: "success",
  draft: "muted",
  archived: "warning",
};

interface ProductActionsProps {
  product: Product;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

function ProductActions({ product, onDuplicate, onDelete }: ProductActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/products/${product.slug}`} target="_blank">
            View on Storefront
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(product.id)}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onClick={() => onDelete(product.id)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function buildProductColumns(onDuplicate: (id: string) => void, onDelete: (id: string) => void): ColumnDef<Product, any>[] {
  return [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
            <Image src={row.original.images[0]?.url ?? ""} alt={row.original.name} fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.sku}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "categorySlug",
      header: "Category",
      cell: ({ row }) => <span className="text-sm capitalize text-muted-foreground">{row.original.categorySlug.replace("-", " ")}</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="font-medium">{formatBDT(row.original.price)}</span>,
    },
    {
      id: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const available = row.original.variants.reduce((sum, v) => sum + (v.stock - v.reservedStock), 0);
        const status = getStockStatus(available);
        return (
          <div>
            <p className="text-sm">{available} units</p>
            <p className={`text-xs ${status === "out-of-stock" ? "text-destructive" : status === "low-stock" ? "text-warning" : "text-muted-foreground"}`}>
              {getStockStatusLabel(status)}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]} className="capitalize">{row.original.status}</Badge>,
    },
    {
      id: "flags",
      header: "Flags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.isFeatured && <Badge variant="outline" className="text-[10px]">Featured</Badge>}
          {row.original.isBestSeller && <Badge variant="outline" className="text-[10px]">Best Seller</Badge>}
          {row.original.isNewArrival && <Badge variant="outline" className="text-[10px]">New</Badge>}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ProductActions product={row.original} onDuplicate={onDuplicate} onDelete={onDelete} />,
    },
  ];
}
