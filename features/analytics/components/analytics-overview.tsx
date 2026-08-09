"use client";

import { useState } from "react";
import { DollarSign, ShoppingCart, Percent, RotateCcw } from "lucide-react";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { SalesChart } from "@/features/admin/components/sales-chart";
import { DateRangeSelect } from "@/features/analytics/components/date-range-select";
import { useDashboardMetrics, useRevenueSeries } from "@/features/analytics/hooks/use-analytics";
import { formatBDT } from "@/lib/utils";
import type { DateRange } from "@/features/analytics/services/analytics.service";

export function AnalyticsOverview() {
  const [range, setRange] = useState<DateRange>("30d");
  const { data: metrics } = useDashboardMetrics(range);
  const { data: revenueSeries = [] } = useRevenueSeries(range);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sales Overview</h2>
        <DateRangeSelect value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Revenue" value={formatBDT(metrics?.revenue ?? 0)} changePct={metrics?.revenueChangePct} icon={DollarSign} />
        <DashboardCard label="Orders" value={(metrics?.orders ?? 0).toLocaleString()} changePct={metrics?.ordersChangePct} icon={ShoppingCart} />
        <DashboardCard label="Conversion Rate" value={`${metrics?.conversionRatePct ?? 0}%`} icon={Percent} />
        <DashboardCard label="Refunds" value={String(metrics?.refunds ?? 0)} icon={RotateCcw} />
      </div>

      <SalesChart data={revenueSeries} />
    </div>
  );
}
