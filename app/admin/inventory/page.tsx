"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Boxes, PackageX, AlertTriangle, Wallet } from "lucide-react";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { DataTable } from "@/components/shared/data-table";
import { StockActivityFeed } from "@/features/inventory/components/stock-activity-feed";
import { AdjustStockDialog } from "@/features/inventory/components/adjust-stock-dialog";
import { buildInventoryColumns } from "@/features/inventory/components/inventory-columns";
import { useInventorySummary, useInventoryRows, useInventoryActivity } from "@/features/inventory/hooks/use-inventory";
import { formatBDT } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function AdminInventoryContent() {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") as "low-stock" | "out-of-stock" | null) ?? undefined;
  const [filter, setFilter] = useState<"low-stock" | "out-of-stock" | "all">(initialFilter ?? "all");
  const [adjustingProductId, setAdjustingProductId] = useState<string | null>(null);

  const { data: summary } = useInventorySummary();
  const { data: rows = [], isLoading, isError, refetch } = useInventoryRows(filter === "all" ? undefined : filter);
  const { data: activity = [] } = useInventoryActivity();

  const columns = buildInventoryColumns((productId) => setAdjustingProductId(productId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">Stock levels across all products</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Total Stock Units" value={(summary?.totalStock ?? 0).toLocaleString()} icon={Boxes} />
        <DashboardCard label="Low Stock Products" value={String(summary?.lowStockCount ?? 0)} icon={AlertTriangle} />
        <DashboardCard label="Out of Stock" value={String(summary?.outOfStockCount ?? 0)} icon={PackageX} />
        <DashboardCard label="Stock Value" value={formatBDT(summary?.stockValue ?? 0)} icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="low-stock">Low Stock Only</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock Only</SelectItem>
            </SelectContent>
          </Select>

          <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            emptyTitle="No products match this filter"
          />
        </div>

        <StockActivityFeed activity={activity} />
      </div>

      <AdjustStockDialog productId={adjustingProductId} onOpenChange={(open) => !open && setAdjustingProductId(null)} />
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded bg-secondary" />}>
      <AdminInventoryContent />
    </Suspense>
  );
}
