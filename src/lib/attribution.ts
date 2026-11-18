import { siteConfig } from "@/config/site";
import { isSegmentId, type SegmentId } from "@/content/audiences";

/**
 * Where a visitor came from, taken from the `fit_attr` cookie that
 * AttributionCapture writes when someone arrives from a paid ad. Also the
 * Meta click values (`fbc`, `fbp`). No Node imports, so the button (browser)
 * and the Tally webhook (server) use the same checks.
 *
 * Everything here may come from a cookie or a form, so it is checked before
 * use: ids are short plain tokens, the segment must be one of ours.
 */
export type Attribution = {
  /** Segment the ad was written for (`fit_seg` in the ad URL). */
  seg?: SegmentId;
  campaign?: string;
  adset?: string;
  ad?: string;
  placement?: string;
  fbclid?: string;
  /** Page the visitor first landed on, e.g. "/families". */
  path?: string;
  /** Click time in milliseconds since the epoch. */
  at?: number;
};

/** Name of the first-party cookie AttributionCapture writes on a paid click. */
export const ATTRIBUTION_COOKIE = "fit_attr";

const DAY_MS = 24 * 60 * 60 * 1000;
const ID_RE = /^[A-Za-z0-9_.:-]{1,64}$/;

/** Meta's click value: `fb.<subdomain index>.<click time in ms>.<fbclid>`. */
const FBC_RE = /^fb\.[0-2]\.\d{10,13}\.[A-Za-z0-9_-]{1,300}$/;
/** Meta's browser id: `fb.<subdomain index>.<time in ms>.<random number>`. */
const FBP_RE = /^fb\.[0-2]\.\d{10,13}\.\d{1,20}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isFbc = (value: unknown): value is string => typeof value === "string" && FBC_RE.test(value);
export const isFbp = (value: unknown): value is string => typeof value === "string" && FBP_RE.test(value);
export const isClickId = (value: unknown): value is string => typeof value === "string" && UUID_RE.test(value);

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

/** Meta's `fbc` format, rebuilt from the stored `fbclid` and click time. */
export function fbcFromClick(attribution: Attribution | undefined): string | undefined {
  if (!attribution?.fbclid || !attribution.at) return undefined;
  const value = `fb.1.${attribution.at}.${attribution.fbclid}`;
  return isFbc(value) ? value : undefined;
}

/** Click time (ms) inside an `fbc` value, or undefined. */
export function fbcClickTime(fbc: string | undefined): number | undefined {
  if (!isFbc(fbc)) return undefined;
  return Number(fbc.split(".")[2]);
}

/** True when the click time is recent enough to credit the ad (default 7 days, like Ads Manager's click window). */
export function isWithinWindow(clickTimeMs: number | undefined, now = Date.now()): boolean {
  if (!clickTimeMs) return false;
  const age = now - clickTimeMs;
  return age >= 0 && age <= siteConfig.tracking.attributionWindowDays * DAY_MS;
}

/** Value of one cookie from a `document.cookie` style string. */
export function readCookie(cookieString: string, name: string): string | undefined {
  for (const part of cookieString.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return undefined;
}

/**
 * The Meta click value for a signup: Meta's own `_fbc` cookie when it exists,
 * otherwise one built from the `fbclid` stored in `fit_attr`.
 */
export function pickFbc(cookieString: string): string | undefined {
  const own = readCookie(cookieString, "_fbc");
  if (isFbc(own)) return own;
  return fbcFromClick(parseAttribution(readCookie(cookieString, ATTRIBUTION_COOKIE)));
}

export function pickFbp(cookieString: string): string | undefined {
  const own = readCookie(cookieString, "_fbp");
  return isFbp(own) ? own : undefined;
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
