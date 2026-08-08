import { formatBDT } from "@/lib/utils";
import { getDeliveryCharge, calculateOrderTotal, type DeliveryZone } from "@/lib/business-logic";
import { Separator } from "@/components/ui/separator";
import type { AppliedCoupon } from "@/types/cart";

interface OrderSummaryProps {
  subtotal: number;
  coupon: AppliedCoupon | null;
  zone?: DeliveryZone;
  itemCount: number;
}

export function OrderSummary({ subtotal, coupon, zone, itemCount }: OrderSummaryProps) {
  const discount = coupon?.discountAmount ?? 0;
  const deliveryCharge = zone ? (coupon?.type === "free-delivery" ? 0 : getDeliveryCharge(zone, subtotal)) : undefined;
  const total = calculateOrderTotal({ subtotal, discount, deliveryCharge: deliveryCharge ?? 0 });

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
        <span className="font-medium">{formatBDT(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-success">
          <span>Discount</span>
          <span>−{formatBDT(discount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Delivery</span>
        <span className="font-medium">
          {deliveryCharge === undefined ? (
            <span className="text-muted-foreground">Calculated at checkout</span>
          ) : deliveryCharge === 0 ? (
            "Free"
          ) : (
            formatBDT(deliveryCharge)
          )}
        </span>
      </div>
      <Separator />
      <div className="flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>{formatBDT(deliveryCharge === undefined ? subtotal - discount : total)}</span>
      </div>
    </div>
  );
}
