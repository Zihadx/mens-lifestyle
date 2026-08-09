import type { AnalyticsProvider } from "@/lib/analytics/provider";
import type { AnalyticsEvent } from "@/lib/analytics/events";

/**
 * Active only when neither Meta nor GA is configured (see track.ts) — lets
 * developers confirm every event fires correctly before real tracking IDs
 * exist, instead of the tracking architecture being unverifiable until
 * production credentials are connected.
 */
export const consoleProvider: AnalyticsProvider = {
  name: "console",

  isEnabled() {
    return process.env.NODE_ENV !== "production";
  },

  track(event: AnalyticsEvent) {
    // eslint-disable-next-line no-console
    console.info(`%c[analytics] ${event.name}`, "color: #ab8843; font-weight: 600", event.payload, `(id: ${event.id})`);
  },
};
