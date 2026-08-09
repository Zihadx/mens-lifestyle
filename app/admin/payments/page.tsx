"use client";

import { useMemo, useState } from "react";
import { Wallet, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { DataTable } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentColumns } from "@/features/order/components/payment-columns";
import { useOrders } from "@/features/order/hooks/use-orders";
import { formatBDT } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/constants";
import type { PaymentMethod } from "@/types/cart";
import type { PaymentStatus } from "@/lib/business-logic";

export default function AdminPaymentsPage() {
  const [method, setMethod] = useState<PaymentMethod | "all">("all");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useOrders({
    paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    page,
    pageSize: 10,
  });

  const filtered = method === "all" ? data?.items ?? [] : (data?.items ?? []).filter((o) => o.paymentMethod === method);

  const summary = useMemo(() => {
    const items = data?.items ?? [];
    return {
      totalVolume: items.reduce((sum, o) => sum + (o.paymentStatus === "paid" || o.paymentStatus === "cod-collected" ? o.total : 0), 0),
      codPending: items.filter((o) => o.paymentStatus === "cod-pending").length,
      paid: items.filter((o) => o.paymentStatus === "paid" || o.paymentStatus === "cod-collected").length,
      refunded: items.filter((o) => o.paymentStatus === "refunded").length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">Transaction history across all payment methods</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Total Volume (this page)" value={formatBDT(summary.totalVolume)} icon={Wallet} />
        <DashboardCard label="Paid / Collected" value={String(summary.paid)} icon={CheckCircle2} />
        <DashboardCard label="COD Pending" value={String(summary.codPending)} icon={Clock} />
        <DashboardCard label="Refunded" value={String(summary.refunded)} icon={RotateCcw} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={method} onValueChange={(v) => { setMethod(v as PaymentMethod | "all"); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentStatus} onValueChange={(v) => { setPaymentStatus(v as PaymentStatus | "all"); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cod-pending">COD Pending</SelectItem>
            <SelectItem value="cod-collected">COD Collected</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={paymentColumns}
        data={filtered}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No transactions found"
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
