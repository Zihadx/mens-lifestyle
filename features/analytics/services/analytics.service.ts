import { revenueSeries, dashboardMetrics, productPerformance, funnelStages, deliveryAnalytics } from "@/data/analytics";
import type { RevenuePoint, DashboardMetrics, ProductPerformance, FunnelStage, DeliveryAnalytics } from "@/types/analytics";
import { sleep } from "@/lib/utils";

export type DateRange = "today" | "yesterday" | "7d" | "30d" | "90d";

export interface AnalyticsService {
  getDashboardMetrics(range: DateRange): Promise<DashboardMetrics>;
  getRevenueSeries(range: DateRange): Promise<RevenuePoint[]>;
  getProductPerformance(): Promise<ProductPerformance[]>;
  getFunnel(): Promise<FunnelStage[]>;
  getDeliveryAnalytics(): Promise<DeliveryAnalytics>;
}

const RANGE_DAYS: Record<DateRange, number> = { today: 1, yesterday: 1, "7d": 7, "30d": 30, "90d": 90 };

export const mockAnalyticsService: AnalyticsService = {
  async getDashboardMetrics(range) {
    await sleep(350);
    // Scale the fixed 30-day mock proportionally so range selection visibly changes the numbers.
    const factor = RANGE_DAYS[range] / 30;
    return {
      ...dashboardMetrics,
      revenue: Math.round(dashboardMetrics.revenue * factor),
      orders: Math.round(dashboardMetrics.orders * factor),
    };
  },

  async getRevenueSeries(range) {
    await sleep(350);
    const days = Math.min(RANGE_DAYS[range], revenueSeries.length);
    return revenueSeries.slice(-days);
  },

  async getProductPerformance() {
    await sleep(300);
    return productPerformance;
  },

  async getFunnel() {
    await sleep(300);
    return funnelStages;
  },

  async getDeliveryAnalytics() {
    await sleep(300);
    return deliveryAnalytics;
  },
};

export const analyticsService: AnalyticsService = mockAnalyticsService;
