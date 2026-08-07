import type { ProductColor, Size } from "@/types/product";
import type { DeliveryZone } from "@/lib/business-logic";

export interface CartItem {
  /** Unique per product+variant combination, e.g. `${productId}:${variantId}` */
  lineId: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  size: Size;
  color: ProductColor;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  maxQuantity: number;
}

export interface AppliedCoupon {
  code: string;
  type: "percentage" | "fixed" | "free-delivery";
  value: number;
  discountAmount: number;
}

export type PaymentMethod = "cod" | "bkash" | "nagad" | "rocket" | "card";

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  addressLine: string;
  zone: DeliveryZone;
  notes?: string;
}

export interface CheckoutState {
  address: Partial<CheckoutAddress>;
  paymentMethod: PaymentMethod;
  orderNotes: string;
  step: "address" | "payment" | "review" | "complete";
}
