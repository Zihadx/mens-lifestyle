import type { Metadata } from "next";
import { AnalyticsOverview } from "@/features/analytics/components/analytics-overview";
import { CustomerAnalyticsCards } from "@/features/analytics/components/customer-analytics-cards";
import { ProductPerformanceTable } from "@/features/analytics/components/product-performance-table";
import { FunnelChart } from "@/features/analytics/components/funnel-chart";
import { DeliveryChart } from "@/features/analytics/components/delivery-chart";
import { analyticsService } from "@/features/analytics/services/analytics.service";

export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const [productPerformance, funnel, delivery] = await Promise.all([
    analyticsService.getProductPerformance(),
    analyticsService.getFunnel(),
    analyticsService.getDeliveryAnalytics(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Business performance across sales, products, customers, and delivery</p>
      </div>

      <AnalyticsOverview />

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Customers</h2>
        <CustomerAnalyticsCards />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FunnelChart stages={funnel} />
        <DeliveryChart data={delivery} />
      </div>

      <ProductPerformanceTable products={productPerformance} />
    </div>
  );
}
