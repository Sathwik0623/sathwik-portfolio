"use client";

import { ANALYTICS_EVENTS, type AnalyticsEventName } from "./analytics-events";

export { ANALYTICS_EVENTS };
export type { AnalyticsEventName };

type EventMetadata = Record<string, string | number | boolean>;

/** Fire-and-forget anonymous analytics event. Never throws, never blocks the UI. */
export function track(name: AnalyticsEventName, metadata?: EventMetadata) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    name,
    path: window.location.pathname,
    metadata,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/event", blob);
      return;
    }
    fetch("/api/analytics/event", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never break the site experience.
  }
}
