"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Search, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { orderColumns } from "@/features/order/components/order-columns";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/features/order/hooks/use-orders";
import type { OrderStatus } from "@/lib/business-logic";
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
  const [status, setStatus] = useState<OrderStatus | "all">(
    (searchParams.get("status") as OrderStatus) || "all"
  );
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
    if (selectedIds.length === 0) return;

    selectedIds.forEach((id) => {
      updateStatus.mutate({
        id,
        status: "confirmed",
      });
    });

    toast.success(
      `${selectedIds.length} ${
        selectedIds.length === 1 ? "order" : "orders"
      } confirmed`
    );

    setRowSelection({});
  }

  return (
    /*
     * IMPORTANT:
     * min-w-0 prevents this page from forcing its parent wider
     * than the viewport.
     */
    <main className="min-w-0 w-full max-w-full space-y-4 overflow-x-hidden sm:space-y-5 lg:space-y-6">
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <header className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Orders
        </h1>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {data?.total ?? 0} total orders
        </p>
      </header>

      {/* ============================================================
          FILTERS
      ============================================================ */}
      <section className="w-full max-w-full">
        <div className="flex w-full min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              type="search"
              placeholder="Search order #, customer name, or phone..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-10 w-full min-w-0 pl-9"
            />
          </div>

          {/* Status */}
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as OrderStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full sm:w-47.5 sm:shrink-0">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>

              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {getOrderStatusLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* ============================================================
          BULK ACTION
      ============================================================ */}
      {selectedIds.length > 0 && (
        <section
          className="
            w-full max-w-full overflow-hidden
            rounded-lg
            border border-accent/25
            bg-accent/4
          "
        >
          <div
            className="
              flex flex-col gap-3
              p-3
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-4
            "
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle2 className="size-4 text-accent" />
              </div>

              <span className="truncate text-sm font-medium">
                {selectedIds.length}{" "}
                {selectedIds.length === 1 ? "order" : "orders"} selected
              </span>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={bulkConfirm}
              className="w-full shrink-0 sm:w-auto"
            >
              <CheckCircle2 className="size-3.5" />
              Confirm Selected
            </Button>
          </div>
        </section>
      )}

      {/* ============================================================
          RESPONSIVE DATA TABLE
      ============================================================ */}

      {/*
        MOBILE/TABLET:
        The viewport remains fixed.
        ONLY this area scrolls horizontally.

        DESKTOP:
        overflow-x-auto becomes effectively invisible because
        the table fits naturally.
      */}
      <section className="w-full max-w-full min-w-0">
        <div
          className="
            relative
            w-full
            max-w-full
            min-w-0
            overflow-x-auto
            overflow-y-hidden
            overscroll-x-contain
            rounded-lg
            border
            bg-background

            scrollbar-thin
            [scrollbar-color:hsl(var(--border))_transparent]
          "
        >
          <div className="min-w-205">
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
        </div>

        {/* Mobile scroll hint */}
        <p className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground sm:hidden">
          <span>Swipe horizontally to view more</span>
          <span aria-hidden="true">→</span>
        </p>
      </section>
    </main>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <main className="w-full min-w-0 space-y-4">
          <div className="h-7 w-32 animate-pulse rounded bg-secondary" />

          <div className="h-10 w-full animate-pulse rounded bg-secondary" />

          <div className="h-64 w-full animate-pulse rounded bg-secondary" />
        </main>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}