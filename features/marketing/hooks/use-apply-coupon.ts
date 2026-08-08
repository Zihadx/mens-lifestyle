import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { couponService } from "@/features/marketing/services/coupon.service";
import { useCart } from "@/hooks/use-cart";
import { ServiceError } from "@/types/service";

export function useApplyCoupon() {
  const { subtotal, applyCoupon } = useCart();

  return useMutation({
    mutationFn: async (code: string) => {
      // First-order detection would come from the real customer record once
      // auth exists (Milestone 14) — mock services treat every checkout as
      // a potential first order for preview purposes.
      return couponService.validate(code, subtotal, true);
    },
    onSuccess: (result) => {
      applyCoupon(result);
      toast.success(`Coupon "${result.code}" applied`);
    },
    onError: (error) => {
      const message = error instanceof ServiceError ? error.message : "Couldn't apply that coupon.";
      toast.error(message);
    },
  });
}
