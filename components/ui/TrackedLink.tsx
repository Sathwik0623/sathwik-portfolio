"use client";

import { track } from "@/lib/analytics";
import type { AnalyticsEventName } from "@/lib/analytics-events";

type TrackedLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  eventName: AnalyticsEventName;
  metadata?: Record<string, string | number | boolean>;
};

/** External anchor that fires an analytics event on click, then navigates normally. */
export function TrackedLink({ eventName, metadata, onClick, ...rest }: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(eventName, metadata);
        onClick?.(e);
      }}
    />
  );
}
