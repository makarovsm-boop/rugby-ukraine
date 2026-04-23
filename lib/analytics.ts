export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event",
      targetIdOrAction: string,
      parameters?: Record<string, string | number | boolean | undefined>,
    ) => void;
  }
}

export function isAnalyticsEnabled() {
  return Boolean(GA_MEASUREMENT_ID);
}

export function trackPageView(url: string) {
  if (!isAnalyticsEnabled() || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function trackEvent(
  action: string,
  parameters?: Record<string, string | number | boolean | undefined>,
) {
  if (!isAnalyticsEnabled() || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", action, parameters);
}
