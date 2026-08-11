"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { EngagementProvider } from "@/lib/engagement-context";
import { EngagementPrompt } from "@/components/contact/EngagementPrompt";

function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track(ANALYTICS_EVENTS.PAGE_VIEW);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <EngagementProvider>
      <PageViewTracker />
      {children}
      <EngagementPrompt />
    </EngagementProvider>
  );
}
