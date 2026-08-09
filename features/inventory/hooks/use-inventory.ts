import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/features/inventory/services/inventory.service";
import { queryKeys } from "@/lib/query-keys";

export function useInventorySummary() {
  return useQuery({
    queryKey: queryKeys.inventory.summary,
    queryFn: () => inventoryService.getSummary(),
  });
}

export function useInventoryRows(filter?: "low-stock" | "out-of-stock") {
  return useQuery({
    queryKey: [...queryKeys.inventory.rows, filter ?? "all"],
    queryFn: () => inventoryService.listRows(filter),
  });
}

export function useInventoryActivity(limit?: number) {
  return useQuery({
    queryKey: queryKeys.inventory.activity,
    queryFn: () => inventoryService.listRecentActivity(limit),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, quantityChange, reason }: { productId: string; variantId: string; quantityChange: number; reason: string }) =>
      inventoryService.adjustStock(productId, variantId, quantityChange, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
