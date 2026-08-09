import { coupons as seedCoupons, getCouponByCode } from "@/data/coupons";
import type { Coupon } from "@/types/misc";
import type { AppliedCoupon } from "@/types/cart";
import { ServiceError } from "@/types/service";
import { sleep } from "@/lib/utils";

export type CreateCouponInput = Omit<Coupon, "id" | "usageCount">;
export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface CouponService {
  list(): Promise<Coupon[]>;
  validate(code: string, subtotal: number, isFirstOrder: boolean): Promise<AppliedCoupon>;
  create(input: CreateCouponInput): Promise<Coupon>;
  update(id: string, input: UpdateCouponInput): Promise<Coupon>;
  remove(id: string): Promise<void>;
  toggleActive(id: string): Promise<Coupon>;
}

const couponStore: Coupon[] = [...seedCoupons];

function computeDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "free-delivery") return 0;
  if (coupon.type === "fixed") return coupon.value;
  const raw = Math.round((subtotal * coupon.value) / 100);
  return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
}

export const mockCouponService: CouponService = {
  async list() {
    await sleep(250);
    return [...couponStore].sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  },

  async validate(code, subtotal, isFirstOrder) {
    await sleep(400);
    const coupon = couponStore.find((c) => c.code.toLowerCase() === code.toLowerCase());

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

    coupon.usageCount += 1;

    return {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount: computeDiscount(coupon, subtotal),
    };
  },

  async create(input) {
    await sleep(400);
    const coupon: Coupon = { ...input, id: `cpn_${Date.now()}`, usageCount: 0 };
    couponStore.unshift(coupon);
    return coupon;
  },

  async update(id, input) {
    await sleep(400);
    const index = couponStore.findIndex((c) => c.id === id);
    if (index === -1) throw new ServiceError(`Coupon ${id} not found`, "not-found");
    couponStore[index] = { ...couponStore[index]!, ...input };
    return couponStore[index]!;
  },

  async remove(id) {
    await sleep(300);
    const index = couponStore.findIndex((c) => c.id === id);
    if (index === -1) throw new ServiceError(`Coupon ${id} not found`, "not-found");
    couponStore.splice(index, 1);
  },

  async toggleActive(id) {
    await sleep(250);
    const coupon = couponStore.find((c) => c.id === id);
    if (!coupon) throw new ServiceError(`Coupon ${id} not found`, "not-found");
    coupon.isActive = !coupon.isActive;
    return coupon;
  },
};

export const couponService: CouponService = mockCouponService;
export { getCouponByCode };
