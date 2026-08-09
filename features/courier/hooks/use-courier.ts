import { useQuery } from "@tanstack/react-query";
import { courierService } from "@/features/courier/services/courier.service";
import { queryKeys } from "@/lib/query-keys";

export function useCourierShipments() {
  return useQuery({
    queryKey: queryKeys.courier.all,
    queryFn: () => courierService.list(),
  });
}
