/**
 * Canonical commerce events, named after Meta Pixel's standard events
 * (https://developers.facebook.com/docs/meta-pixel/reference) since they're
 * the strictest of the two schemas — the GA4 provider maps these onto its
 * own event names internally (see providers/ga4.ts).
 */
export type AnalyticsEventName =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "AddToCart"
  | "AddToWishlist"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration"
  | "Contact";

export interface AnalyticsEventPayload {
  value?: number;
  currency?: string;
  contentIds?: string[];
  contentName?: string;
  contentCategory?: string;
  contentType?: "product" | "product_group";
  numItems?: number;
  searchString?: string;
  orderId?: string;
  [key: string]: unknown;
}

/**
 * Every dispatched event carries a stable, client-generated ID. Meta's
 * Conversion API deduplicates a server-side event against its browser-side
 * Pixel twin by matching this same ID on both — generating it once here
 * (rather than separately in the browser pixel call and a future server
 * action) is what makes that deduplication actually work instead of
 * double-counting the same purchase.
 */
export interface AnalyticsEvent {
  id: string;
  name: AnalyticsEventName;
  payload: AnalyticsEventPayload;
  timestamp: number;
}
