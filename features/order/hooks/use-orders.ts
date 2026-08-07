import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService, type OrderQuery, type CreateOrderInput } from "@/features/order/services/order.service";
import { queryKeys } from "@/lib/query-keys";
import type { OrderStatus } from "@/lib/business-logic";

export function useOrders(query: OrderQuery) {
  return useQuery({
    queryKey: queryKeys.orders.list(query),
    queryFn: () => orderService.list(query),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useCustomerOrders(customerId: string) {
  return useQuery({
    queryKey: queryKeys.orders.byCustomer(customerId),
    queryFn: () => orderService.getByCustomerId(customerId),
    enabled: !!customerId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => orderService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) =>
      orderService.updateStatus(id, status, note),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(order.id) });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => orderService.cancel(id, reason),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(order.id) });
    },
  });
}
