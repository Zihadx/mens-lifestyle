import { useQuery } from "@tanstack/react-query";
import { customerService, type CustomerQuery } from "@/features/customer/services/customer.service";
import { queryKeys } from "@/lib/query-keys";

export function useCustomers(query: CustomerQuery) {
  return useQuery({
    queryKey: queryKeys.customers.list(query),
    queryFn: () => customerService.list(query),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
}
