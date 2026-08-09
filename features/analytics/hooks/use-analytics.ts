import { useQuery } from "@tanstack/react-query";
import { analyticsService, type DateRange } from "@/features/analytics/services/analytics.service";
import { queryKeys } from "@/lib/query-keys";

export function useDashboardMetrics(range: DateRange) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(range),
    queryFn: () => analyticsService.getDashboardMetrics(range),
  });
}

export function useRevenueSeries(range: DateRange) {
  return useQuery({
    queryKey: queryKeys.analytics.revenue(range),
    queryFn: () => analyticsService.getRevenueSeries(range),
  });
}

export function useProductPerformance() {
  return useQuery({
    queryKey: queryKeys.analytics.productPerformance,
    queryFn: () => analyticsService.getProductPerformance(),
  });
}

export function useFunnel() {
  return useQuery({
    queryKey: queryKeys.analytics.funnel,
    queryFn: () => analyticsService.getFunnel(),
  });
}

export function useDeliveryAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.delivery,
    queryFn: () => analyticsService.getDeliveryAnalytics(),
  });
}
