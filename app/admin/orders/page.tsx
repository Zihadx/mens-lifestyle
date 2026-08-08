"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { orderColumns } from "@/features/order/components/order-columns";
import { useOrders, useUpdateOrderStatus } from "@/features/order/hooks/use-orders";
import type { OrderStatus, PaymentStatus } from "@/lib/business-logic";
import { getOrderStatusLabel } from "@/lib/business-logic";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "picked-up",
  "in-transit",
  "out-for-delivery",
  "delivered",
  "cancelled",
  "failed-delivery",
  "returned",
  "refunded",
];

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">((searchParams.get("status") as OrderStatus) || "all");
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading, isError, refetch } = useOrders({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    page,
    pageSize: 10,
  });
  const updateStatus = useUpdateOrderStatus();

  const selectedIds = Object.keys(rowSelection);

  function bulkConfirm() {
    selectedIds.forEach((id) => updateStatus.mutate({ id, status: "confirmed" }));
    toast.success(`${selectedIds.length} order(s) confirmed`);
    setRowSelection({});
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">{data?.total ?? 0} total orders</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order #, customer name, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as OrderStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {getOrderStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-accent/30 bg-accent/5 px-4 py-2.5">
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <Button size="sm" onClick={bulkConfirm}>
            <CheckCircle2 className="size-3.5" /> Confirm Selected
          </Button>
        </div>
      )}

      <DataTable
        columns={orderColumns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No orders found"
        emptyDescription="Try a different search term or status filter."
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(order) => order.id}
      />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded bg-secondary" />}>
      <AdminOrdersContent />
    </Suspense>
  );
}
