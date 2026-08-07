export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerAvatarUrl?: string;
  rating: number;
  title?: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  status: "published" | "pending" | "reported";
  createdAt: string;
}

export type CouponType = "percentage" | "fixed" | "free-delivery";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isFirstOrderOnly: boolean;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

export type CourierStatus =
  | "pending-pickup"
  | "picked-up"
  | "in-transit"
  | "out-for-delivery"
  | "delivered"
  | "failed"
  | "returned";

export interface CourierShipment {
  id: string;
  orderId: string;
  orderNumber: string;
  provider: string;
  trackingId: string;
  trackingUrl: string;
  status: CourierStatus;
  pickupAddress: string;
  deliveryAddress: string;
  codAmount: number;
  deliveryCharge: number;
  estimatedDelivery: string;
  createdAt: string;
}

export type NotificationCategory = "orders" | "payments" | "inventory" | "customers" | "marketing" | "system";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  href?: string;
}

export type StockActivityType = "reserved" | "reduced" | "restored" | "adjusted" | "restocked";

export interface StockActivity {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: StockActivityType;
  quantityChange: number;
  reason: string;
  createdAt: string;
}
