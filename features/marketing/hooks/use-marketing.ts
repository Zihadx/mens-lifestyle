import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketingService } from "@/features/marketing/services/marketing.service";
import {
  couponService,
  type CreateCouponInput,
  type UpdateCouponInput,
} from "@/features/marketing/services/coupon.service";
import { queryKeys } from "@/lib/query-keys";

export function useCampaigns() {
  return useQuery({
    queryKey: ["marketing", "campaigns"],
    queryFn: () => marketingService.listCampaigns(),
  });
}

export function useCoupons() {
  return useQuery({
    queryKey: queryKeys.coupons.all,
    queryFn: () => couponService.list(),
  });
}

function useInvalidateCoupons() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all });
}

export function useCreateCoupon() {
  const invalidate = useInvalidateCoupons();
  return useMutation({
    mutationFn: (input: CreateCouponInput) => couponService.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateCoupon() {
  const invalidate = useInvalidateCoupons();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCouponInput }) => couponService.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCoupon() {
  const invalidate = useInvalidateCoupons();
  return useMutation({
    mutationFn: (id: string) => couponService.remove(id),
    onSuccess: invalidate,
  });
}

export function useToggleCouponActive() {
  const invalidate = useInvalidateCoupons();
  return useMutation({
    mutationFn: (id: string) => couponService.toggleActive(id),
    onSuccess: invalidate,
  });
}
