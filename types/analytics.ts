export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardMetrics {
  revenue: number;
  revenueChangePct: number;
  orders: number;
  ordersChangePct: number;
  averageOrderValue: number;
  conversionRatePct: number;
  customers: number;
  returningCustomerPct: number;
  refunds: number;
  cancelledOrders: number;
  deliverySuccessRatePct: number;
  codSuccessRatePct: number;
}

export interface ProductPerformance {
  productId: string;
  name: string;
  image: string;
  views: number;
  addToCartRate: number;
  purchaseRate: number;
  unitsSold: number;
  revenue: number;
}

export interface FunnelStage {
  stage: "Visitors" | "Product Views" | "Add to Cart" | "Checkout" | "Payment" | "Purchase";
  count: number;
}

export interface DeliveryAnalytics {
  delivered: number;
  inTransit: number;
  pending: number;
  cancelled: number;
  returned: number;
  failed: number;
  successRatePct: number;
}
