"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useApplyCoupon } from "@/features/marketing/hooks/use-apply-coupon";
import { formatBDT } from "@/lib/utils";

export function CouponForm() {
  const { coupon, removeCoupon } = useCart();
  const applyCoupon = useApplyCoupon();
  const [code, setCode] = useState("");

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/5 px-3 py-2.5">
        <div className="flex items-center gap-2 text-sm">
          <Tag className="size-4 text-success" />
          <span className="font-medium">{coupon.code}</span>
          <span className="text-muted-foreground">
            {coupon.type === "free-delivery" ? "Free delivery applied" : `−${formatBDT(coupon.discountAmount)}`}
          </span>
        </div>
        <button onClick={removeCoupon} aria-label="Remove coupon" className="text-muted-foreground hover:text-destructive">
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return;
        applyCoupon.mutate(code.trim(), { onSuccess: () => setCode("") });
      }}
      className="flex gap-2"
    >
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Coupon code"
        className="h-10"
        aria-label="Coupon code"
      />
      <Button type="submit" variant="outline" loading={applyCoupon.isPending} className="shrink-0">
        Apply
      </Button>
    </form>
  );
}
