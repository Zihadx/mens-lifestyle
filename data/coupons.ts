import type { Coupon } from "@/types/misc";

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const coupons: Coupon[] = [
  {
    id: "cpn_0001",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderValue: 1000,
    maxDiscount: 500,
    usageLimit: 1,
    usageCount: 0,
    isFirstOrderOnly: true,
    startsAt: daysAgo(90),
    expiresAt: daysFromNow(180),
    isActive: true,
  },
  {
    id: "cpn_0002",
    code: "EID500",
    type: "fixed",
    value: 500,
    minOrderValue: 2500,
    usageLimit: 500,
    usageCount: 214,
    isFirstOrderOnly: false,
    startsAt: daysAgo(10),
    expiresAt: daysFromNow(20),
    isActive: true,
  },
  {
    id: "cpn_0003",
    code: "FREESHIP",
    type: "free-delivery",
    value: 0,
    minOrderValue: 1500,
    usageCount: 890,
    isFirstOrderOnly: false,
    startsAt: daysAgo(30),
    expiresAt: daysFromNow(60),
    isActive: true,
  },
  {
    id: "cpn_0004",
    code: "FLASH20",
    type: "percentage",
    value: 20,
    minOrderValue: 2000,
    maxDiscount: 800,
    usageLimit: 200,
    usageCount: 178,
    isFirstOrderOnly: false,
    startsAt: daysAgo(2),
    expiresAt: daysFromNow(1),
    isActive: true,
  },
  {
    id: "cpn_0005",
    code: "SUMMER22",
    type: "percentage",
    value: 15,
    minOrderValue: 1200,
    usageCount: 340,
    isFirstOrderOnly: false,
    startsAt: daysAgo(200),
    expiresAt: daysAgo(30),
    isActive: false,
  },
];

export function getCouponByCode(code: string): Coupon | undefined {
  return coupons.find((c) => c.code.toLowerCase() === code.toLowerCase());
}
