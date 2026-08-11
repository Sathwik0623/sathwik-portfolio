"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { track, ANALYTICS_EVENTS } from "./analytics";

type EngagementConfig = {
  /** Show the prompt after this much time on site, if not already shown/dismissed. */
  timeThresholdMs: number;
  /** Or show it once the visitor has opened this many project case studies. */
  projectViewThreshold: number;
  /** Or shortly after the visitor views/downloads the resume. */
  resumeViewDelayMs: number;
};

// Trigger is intentionally configurable in one place.
const DEFAULT_CONFIG: EngagementConfig = {
  timeThresholdMs: 2 * 60_000,
  projectViewThreshold: 2,
  resumeViewDelayMs: 4_000,
};

const DISMISS_KEY = "engagement_prompt_dismissed";

type EngagementContextValue = {
  showPrompt: boolean;
  expanded: boolean;
  expand: () => void;
  dismiss: () => void;
  notifyProjectView: () => void;
  notifyResumeView: () => void;
};

const EngagementContext = createContext<EngagementContextValue | null>(null);

export function EngagementProvider({
  children,
  config = DEFAULT_CONFIG,
}: {
  children: React.ReactNode;
  config?: EngagementConfig;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const projectViews = useRef(0);
  const dismissedRef = useRef(false);
  const shownRef = useRef(false);

  const maybeShow = useCallback(() => {
    if (dismissedRef.current || shownRef.current) return;
    shownRef.current = true;
    setShowPrompt(true);
    track(ANALYTICS_EVENTS.ENGAGEMENT_PROMPT_SHOWN);
  }, []);

  useEffect(() => {
    dismissedRef.current = sessionStorage.getItem(DISMISS_KEY) === "1";
    if (dismissedRef.current) return;

    const timer = setTimeout(maybeShow, config.timeThresholdMs);
    return () => clearTimeout(timer);
  }, [config.timeThresholdMs, maybeShow]);

  const notifyProjectView = useCallback(() => {
    projectViews.current += 1;
    if (projectViews.current >= config.projectViewThreshold) {
      maybeShow();
    }
  }, [config.projectViewThreshold, maybeShow]);

  const notifyResumeView = useCallback(() => {
    setTimeout(maybeShow, config.resumeViewDelayMs);
  }, [config.resumeViewDelayMs, maybeShow]);

  const expand = useCallback(() => {
    setExpanded(true);
    track(ANALYTICS_EVENTS.ENGAGEMENT_PROMPT_OPENED);
  }, []);

  const dismiss = useCallback(() => {
    setShowPrompt(false);
    setExpanded(false);
    dismissedRef.current = true;
    sessionStorage.setItem(DISMISS_KEY, "1");
    track(ANALYTICS_EVENTS.ENGAGEMENT_PROMPT_DISMISSED);
  }, []);

  return (
    <EngagementContext.Provider
      value={{ showPrompt, expanded, expand, dismiss, notifyProjectView, notifyResumeView }}
    >
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const ctx = useContext(EngagementContext);
  if (!ctx) {
    throw new Error("useEngagement must be used within an EngagementProvider");
  }
  return ctx;
}
