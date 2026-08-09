import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addItem,
  removeItem,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  openDrawer,
  closeDrawer,
  clearCart,
  selectCartItems,
  selectCartCoupon,
  selectIsCartDrawerOpen,
  selectCartItemCount,
  selectCartSubtotal,
} from "@/store/slices/cart-slice";
import { calculateOrderTotal, getDeliveryCharge, type DeliveryZone } from "@/lib/business-logic";
import { trackEvent } from "@/lib/analytics/track";
import type { CartItem } from "@/types/cart";

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const coupon = useAppSelector(selectCartCoupon);
  const isDrawerOpen = useAppSelector(selectIsCartDrawerOpen);
  const itemCount = useAppSelector(selectCartItemCount);
  const subtotal = useAppSelector(selectCartSubtotal);

  function getTotals(zone: DeliveryZone = "inside-dhaka") {
    const discount = coupon?.discountAmount ?? 0;
    const deliveryCharge = coupon?.type === "free-delivery" ? 0 : getDeliveryCharge(zone, subtotal);
    const total = calculateOrderTotal({ subtotal, discount, deliveryCharge });
    return { subtotal, discount, deliveryCharge, total };
  }

  return {
    items,
    coupon,
    isDrawerOpen,
    itemCount,
    subtotal,
    getTotals,
    addItem: (item: CartItem) => {
      dispatch(addItem(item));
      trackEvent("AddToCart", {
        value: item.price * item.quantity,
        contentIds: [item.productId],
        contentName: item.name,
        contentType: "product",
        numItems: item.quantity,
      });
    },
    removeItem: (lineId: string) => dispatch(removeItem({ lineId })),
    updateQuantity: (lineId: string, quantity: number) => dispatch(updateQuantity({ lineId, quantity })),
    applyCoupon: (couponPayload: NonNullable<typeof coupon>) => dispatch(applyCoupon(couponPayload)),
    removeCoupon: () => dispatch(removeCoupon()),
    openDrawer: () => dispatch(openDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
    clearCart: () => dispatch(clearCart()),
  };
}
