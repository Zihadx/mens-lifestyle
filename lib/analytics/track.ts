import { nanoid } from "nanoid";
import type { AnalyticsEvent, AnalyticsEventName, AnalyticsEventPayload } from "@/lib/analytics/events";
import type { AnalyticsProvider } from "@/lib/analytics/provider";
import { metaPixelProvider } from "@/lib/analytics/providers/meta-pixel";
import { ga4Provider } from "@/lib/analytics/providers/ga4";
import { consoleProvider } from "@/lib/analytics/providers/console-provider";
import { siteConfig } from "@/config/site";

const providers: AnalyticsProvider[] = [metaPixelProvider, ga4Provider, consoleProvider];

/**
 * The one function the rest of the app calls. Never import a provider
 * directly from a component — swapping providers, adding a new destination,
 * or wiring up server-side Conversion API later all happen here without
 * touching the ~15 call sites across cart/PDP/checkout/search/auth.
 */
export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}) {
  const event: AnalyticsEvent = {
    id: nanoid(),
    name,
    payload: { currency: siteConfig.currency, ...payload },
    timestamp: Date.now(),
  };

  for (const provider of providers) {
    if (provider.isEnabled()) provider.track(event);
  }

  return event.id;
}
