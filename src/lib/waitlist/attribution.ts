import { siteConfig } from "@/config/site";
import { isSegmentId } from "@/content/audiences";
import type { Attribution, DeviceKind } from "@/lib/waitlist/types";

/** Name of the first-party cookie AttributionCapture writes on a paid click. */
export const ATTRIBUTION_COOKIE = "fit_attr";

const DAY_MS = 24 * 60 * 60 * 1000;
const ID_RE = /^[A-Za-z0-9_.:-]{1,64}$/;

function id(value: unknown): string | undefined {
  return typeof value === "string" && ID_RE.test(value) ? value : undefined;
}

/**
 * Read the `fit_attr` cookie value. It is attacker-controllable, so every
 * field is checked: ids are short, plain tokens, the segment must be one of
 * ours, and the time must be a plausible number. Anything else is dropped.
 */
export function parseAttribution(raw: string | undefined, now = Date.now()): Attribution | undefined {
  if (!raw) return undefined;
  let data: unknown;
  try {
    data = JSON.parse(decodeURIComponent(raw));
  } catch {
    return undefined;
  }
  if (typeof data !== "object" || data === null) return undefined;
  const d = data as Record<string, unknown>;

  const seg = isSegmentId(d.seg) ? d.seg : undefined;
  if (!seg) return undefined; // Not one of our paid clicks.

  const at =
    typeof d.at === "number" && Number.isFinite(d.at) && d.at > 0 && d.at <= now + DAY_MS
      ? Math.floor(d.at)
      : undefined;
  const path = typeof d.path === "string" && d.path.startsWith("/") ? d.path.slice(0, 80) : undefined;

  return {
    seg,
    campaign: id(d.campaign),
    adset: id(d.adset),
    ad: id(d.ad),
    placement: id(d.placement),
    fbclid: typeof d.fbclid === "string" && d.fbclid.length <= 300 && /^[\w-]+$/.test(d.fbclid) ? d.fbclid : undefined,
    path,
    at,
  };
}

/** True when the paid click is recent enough to credit the ad (default 7 days, like Ads Manager's click window). */
export function isWithinWindow(attribution: Attribution, now = Date.now()): boolean {
  if (!attribution.at) return false;
  const age = now - attribution.at;
  return age >= 0 && age <= siteConfig.tracking.attributionWindowDays * DAY_MS;
}

/** Team and test addresses: listed in config, or any address with "+test" in it. */
export function isTestEmail(email: string): boolean {
  const lower = email.toLowerCase();
  const local = lower.split("@")[0] ?? "";
  return (
    local.includes("+test") ||
    siteConfig.tracking.testEmails.some((address) => address.toLowerCase() === lower)
  );
}

export function deviceFromUserAgent(userAgent: string): DeviceKind {
  if (/iPhone|iPod/i.test(userAgent)) return "iphone";
  if (/iPad/i.test(userAgent)) return "ipad";
  if (/Android/i.test(userAgent)) return "android";
  if (/Windows NT|Macintosh|X11|CrOS/i.test(userAgent)) return "desktop";
  return "other";
}

/** The Facebook and Instagram apps open links in their own browser. */
export function isInAppBrowser(userAgent: string): boolean {
  return /FBAN|FBAV|FB_IAB|FBIOS|Instagram/i.test(userAgent);
}

/** Meta's `fbc` format, rebuilt from the click id when the `_fbc` cookie is missing. */
export function fbcFromClick(attribution: Attribution | undefined): string | undefined {
  if (!attribution?.fbclid || !attribution.at) return undefined;
  return `fb.1.${attribution.at}.${attribution.fbclid}`;
}
