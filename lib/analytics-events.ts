// Central vocabulary of analytics events tracked across the site.
// Keep this in sync with the admin dashboard queries in app/admin.
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  PROJECT_VIEW: "project_view",
  PROJECT_GITHUB_CLICK: "project_github_click",
  PROJECT_DEMO_CLICK: "project_demo_click",
  RESUME_VIEW: "resume_view",
  RESUME_DOWNLOAD: "resume_download",
  CONTACT_FORM_STARTED: "contact_form_started",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
  LINKEDIN_CLICK: "linkedin_click",
  GITHUB_CLICK: "github_click",
  EXTERNAL_LINK_CLICK: "external_link_click",
  ENGAGEMENT_PROMPT_SHOWN: "engagement_prompt_shown",
  ENGAGEMENT_PROMPT_OPENED: "engagement_prompt_opened",
  ENGAGEMENT_PROMPT_DISMISSED: "engagement_prompt_dismissed",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
