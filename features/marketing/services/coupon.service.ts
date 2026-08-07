import { coupons, getCouponByCode } from "@/data/coupons";
import type { Coupon } from "@/types/misc";
import type { AppliedCoupon } from "@/types/cart";
import { ServiceError } from "@/types/service";
import { sleep } from "@/lib/utils";

export interface CouponService {
  list(): Promise<Coupon[]>;
  validate(code: string, subtotal: number, isFirstOrder: boolean): Promise<AppliedCoupon>;
}

function computeDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "free-delivery") return 0; // handled separately as delivery waiver
  if (coupon.type === "fixed") return coupon.value;
  const raw = Math.round((subtotal * coupon.value) / 100);
  return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
}

export const mockCouponService: CouponService = {
  async list() {
    await sleep(250);
    return coupons.filter((c) => c.isActive);
  },

  async validate(code, subtotal, isFirstOrder) {
    await sleep(400);
    const coupon = getCouponByCode(code);

    if (!coupon) throw new ServiceError("This coupon code doesn't exist.", "not-found");
    if (!coupon.isActive) throw new ServiceError("This coupon is no longer active.", "validation");

    const now = Date.now();
    if (now < new Date(coupon.startsAt).getTime() || now > new Date(coupon.expiresAt).getTime()) {
      throw new ServiceError("This coupon has expired.", "validation");
    }
    if (coupon.isFirstOrderOnly && !isFirstOrder) {
      throw new ServiceError("This coupon is only valid on your first order.", "validation");
    }
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      throw new ServiceError(`Add ৳${coupon.minOrderValue - subtotal} more to use this coupon.`, "validation");
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new ServiceError("This coupon has reached its usage limit.", "validation");
    }

    return {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount: computeDiscount(coupon, subtotal),
    };
  },
};

export const couponService: CouponService = mockCouponService;
