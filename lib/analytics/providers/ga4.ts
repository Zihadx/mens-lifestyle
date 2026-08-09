import type { AnalyticsProvider } from "@/lib/analytics/provider";
import type { AnalyticsEvent, AnalyticsEventName } from "@/lib/analytics/events";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// GA4 has its own standard event vocabulary, distinct from Meta's — this is
// the translation layer so the rest of the app only ever thinks in the
// canonical names from lib/analytics/events.ts.
const GA4_EVENT_MAP: Record<AnalyticsEventName, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  Search: "search",
  AddToCart: "add_to_cart",
  AddToWishlist: "add_to_wishlist",
  InitiateCheckout: "begin_checkout",
  AddPaymentInfo: "add_payment_info",
  Purchase: "purchase",
  Lead: "generate_lead",
  CompleteRegistration: "sign_up",
  Contact: "contact",
};

export const ga4Provider: AnalyticsProvider = {
  name: "ga4",

  isEnabled() {
    return typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_GA_ID && typeof window.gtag === "function";
  },

  track(event: AnalyticsEvent) {
    if (!this.isEnabled()) return;

    window.gtag!("event", GA4_EVENT_MAP[event.name], buildGa4Params(event));
  },
};

function buildGa4Params(event: AnalyticsEvent) {
  const { value, currency, contentIds, contentName, contentCategory, numItems, searchString, orderId } = event.payload;
  return {
    ...(value !== undefined && { value }),
    ...(currency && { currency }),
    ...(contentIds && { item_ids: contentIds }),
    ...(contentName && { item_name: contentName }),
    ...(contentCategory && { item_category: contentCategory }),
    ...(numItems !== undefined && { items_count: numItems }),
    ...(searchString && { search_term: searchString }),
    ...(orderId && { transaction_id: orderId }),
    event_id: event.id,
  };
}
