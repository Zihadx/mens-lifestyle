import type { Metadata } from "next";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { SalesChart } from "@/features/admin/components/sales-chart";
import { OrderStatusChart } from "@/features/admin/components/order-status-chart";
import { RecentOrdersWidget } from "@/features/admin/components/recent-orders-widget";
import { TopProductsWidget } from "@/features/admin/components/top-products-widget";
import { AlertsWidget } from "@/features/admin/components/alerts-widget";
import { analyticsService } from "@/features/analytics/services/analytics.service";
import { orderService } from "@/features/order/services/order.service";
import { inventoryService } from "@/features/inventory/services/inventory.service";
import { formatBDT } from "@/lib/utils";
import type { OrderStatus } from "@/lib/business-logic";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const [metrics, revenueSeries, productPerformance, allOrders, pendingOrders, inventorySummary] = await Promise.all([
    analyticsService.getDashboardMetrics("30d"),
    analyticsService.getRevenueSeries("30d"),
    analyticsService.getProductPerformance(),
    orderService.list({ page: 1, pageSize: 100 }),
    orderService.list({ status: "pending", page: 1, pageSize: 1 }),
    inventoryService.getSummary(),
  ]);

  const statusCounts = allOrders.items.reduce<Partial<Record<OrderStatus, number>>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});

  const recentOrders = allOrders.items.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Last 30 days</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardCard label="Revenue" value={formatBDT(metrics.revenue)} changePct={metrics.revenueChangePct} icon={DollarSign} />
        <DashboardCard label="Orders" value={metrics.orders.toLocaleString()} changePct={metrics.ordersChangePct} icon={ShoppingCart} />
        <DashboardCard label="Customers" value={metrics.customers.toLocaleString()} icon={Users} />
        <DashboardCard label="Conversion Rate" value={`${metrics.conversionRatePct}%`} icon={TrendingUp} />
      </div>

      <AlertsWidget
        lowStockCount={inventorySummary.lowStockCount}
        outOfStockCount={inventorySummary.outOfStockCount}
        pendingOrdersCount={pendingOrders.total}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart data={revenueSeries} />
        </div>
        <OrderStatusChart counts={statusCounts} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersWidget orders={recentOrders} />
        </div>
        <TopProductsWidget products={productPerformance} />
      </div>
    </div>
  );
}
