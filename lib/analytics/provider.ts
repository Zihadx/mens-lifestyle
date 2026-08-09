import type { AnalyticsEvent } from "@/lib/analytics/events";

export interface AnalyticsProvider {
  name: string;
  /** Providers decide their own readiness (e.g. "is a Pixel ID configured?"). */
  isEnabled(): boolean;
  track(event: AnalyticsEvent): void;
}
