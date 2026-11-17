/**
 * Browser side of Meta tracking. Safe to call anywhere: it does nothing when
 * the Pixel is not loaded (no NEXT_PUBLIC_META_PIXEL_ID, an ad blocker, or
 * a browser that blocks it). The Tally webhook still reports the signup
 * through the Conversions API, using the same event id.
 */

type Fbq = (
  command: "track",
  eventName: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/**
 * Fire Lead with Tally's submission id as the event id. Returns false when
 * the Pixel is not there (yet), so the caller can try again.
 */
export function trackLead(submissionId: string, segment?: string): boolean {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
  window.fbq("track", "Lead", segment ? { content_name: segment } : {}, { eventID: submissionId });
  return true;
}
