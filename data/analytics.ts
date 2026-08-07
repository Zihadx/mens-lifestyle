import type { RevenuePoint, DashboardMetrics, ProductPerformance, FunnelStage, DeliveryAnalytics } from "@/types/analytics";
import { products } from "@/data/products";

function daysAgo(days: number): string {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

// 30-day revenue series with a realistic weekly cadence (weekends dip, campaign spikes)
export const revenueSeries: RevenuePoint[] = Array.from({ length: 30 }).map((_, i) => {
  const dayIndex = 29 - i;
  const dow = new Date(Date.now() - dayIndex * 24 * 60 * 60 * 1000).getDay();
  const isWeekend = dow === 5 || dow === 6; // Fri/Sat weekend in Bangladesh
  const isCampaignSpike = dayIndex === 6 || dayIndex === 18;
  const base = 28000 + Math.sin(i / 3) * 6000;
  const revenue = Math.round(base * (isWeekend ? 1.35 : 1) * (isCampaignSpike ? 1.8 : 1) + Math.random() * 4000);
  const orders = Math.round(revenue / 1750);
  return { date: daysAgo(dayIndex), revenue, orders };
});

export const dashboardMetrics: DashboardMetrics = {
  revenue: revenueSeries.reduce((sum, p) => sum + p.revenue, 0),
  revenueChangePct: 12.4,
  orders: revenueSeries.reduce((sum, p) => sum + p.orders, 0),
  ordersChangePct: 8.1,
  averageOrderValue: 1780,
  conversionRatePct: 2.6,
  customers: 842,
  returningCustomerPct: 34.5,
  refunds: 6,
  cancelledOrders: 14,
  deliverySuccessRatePct: 91.2,
  codSuccessRatePct: 87.4,
};

export const productPerformance: ProductPerformance[] = products.slice(0, 8).map((p, i) => ({
  productId: p.id,
  name: p.name,
  image: p.images[0]?.url ?? "",
  views: 4200 - i * 320 + Math.round(Math.random() * 500),
  addToCartRate: Math.round((18 - i * 0.8) * 10) / 10,
  purchaseRate: Math.round((6.5 - i * 0.3) * 10) / 10,
  unitsSold: 210 - i * 18,
  revenue: (210 - i * 18) * p.price,
}));

export const funnelStages: FunnelStage[] = [
  { stage: "Visitors", count: 48200 },
  { stage: "Product Views", count: 21400 },
  { stage: "Add to Cart", count: 6300 },
  { stage: "Checkout", count: 3100 },
  { stage: "Payment", count: 2650 },
  { stage: "Purchase", count: 2480 },
];

export const deliveryAnalytics: DeliveryAnalytics = {
  delivered: 2180,
  inTransit: 145,
  pending: 62,
  cancelled: 48,
  returned: 31,
  failed: 34,
  successRatePct: 91.2,
};
