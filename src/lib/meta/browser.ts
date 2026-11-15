/**
 * Browser side of Meta tracking. Safe to call anywhere: it does nothing when
 * the Pixel is not loaded (no NEXT_PUBLIC_META_PIXEL_ID, an ad blocker, or
 * a browser that blocks it). The server still reports the signup through
 * the Conversions API, using the same event id.
 */

type Fbq = (
  command: "track" | "trackCustom",
  eventName: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export function trackMetaEvent(eventName: "Lead" | "CrossSegmentSignup", eventId: string): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const command = eventName === "Lead" ? "track" : "trackCustom";
  window.fbq(command, eventName, {}, { eventID: eventId });
}
