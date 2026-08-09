import type { AnalyticsProvider } from "@/lib/analytics/provider";
import type { AnalyticsEvent } from "@/lib/analytics/events";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const metaPixelProvider: AnalyticsProvider = {
  name: "meta-pixel",

  isEnabled() {
    return typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_META_PIXEL_ID && typeof window.fbq === "function";
  },

  track(event: AnalyticsEvent) {
    if (!this.isEnabled()) return;

    // eventID enables Meta's Conversion API deduplication once a server-side
    // CAPI call is added later — same event, same ID, counted once.
    window.fbq!("track", event.name, buildMetaParams(event), { eventID: event.id });
  },
};

function buildMetaParams(event: AnalyticsEvent) {
  const { value, currency, contentIds, contentName, contentCategory, contentType, numItems, searchString } = event.payload;
  return {
    ...(value !== undefined && { value }),
    ...(currency && { currency }),
    ...(contentIds && { content_ids: contentIds }),
    ...(contentName && { content_name: contentName }),
    ...(contentCategory && { content_category: contentCategory }),
    ...(contentType && { content_type: contentType }),
    ...(numItems !== undefined && { num_items: numItems }),
    ...(searchString && { search_string: searchString }),
  };
}
