import type {
  OfferModel,
  ResidentRange,
  Role,
  SegmentId,
  WhoFor,
} from "@/content/audiences";

/**
 * Where a visitor came from, taken from the `fit_attr` cookie that
 * AttributionCapture writes when someone arrives from a paid ad.
 * All values are short strings with a length limit, never trusted markup.
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

export type DeviceKind = "iphone" | "ipad" | "android" | "desktop" | "other";

/** A validated waitlist signup, ready to be stored. */
export type WaitlistEntry = {
  /** Random id. Hashed and sent to Meta as `external_id`. */
  id: string;
  email: string;
  /** The segment whose form was submitted. */
  variant: SegmentId;
  /** Families form: who the helper is for. */
  whoFor?: WhoFor;
  /** Senior living form: the community's name. */
  organization?: string;
  residents?: ResidentRange;
  role?: Role;
  offerModel?: OfferModel;
  /** Page the form was submitted from, e.g. "/families". */
  source: string;
  /** ISO 8601 timestamp set on the server. */
  createdAt: string;

  /** Paid-ad attribution, when the visitor arrived from one. */
  attribution?: Attribution;
  /** True when the attribution is a paid click inside the attribution window. */
  paid: boolean;
  /** Paid click for a different segment than the form that was submitted. */
  crossSegment: boolean;
  /** Team or test address. Stored, never counted, never sent to Meta. */
  test: boolean;
  /** True only for a matched, new, non-test signup from a paid ad. This is the number cost per signup uses. */
  counted: boolean;
  /** Shared by the Pixel and the Conversions API so Meta counts the event once. */
  eventId?: string;
  eventName?: "Lead" | "CrossSegmentSignup";
  device?: DeviceKind;
  /** Opened inside the Facebook or Instagram app's built-in browser. */
  inApp?: boolean;
};

/** One honeypot hit. Logged on its own, never stored as a signup. */
export type BotHit = {
  at: string;
  variant?: string;
  source?: string;
};

/**
 * Pluggable storage. Implement this to send signups to Resend, Loops,
 * a database, a spreadsheet, or anything else.
 */
export interface WaitlistProvider {
  /** Human-readable name used in logs. */
  readonly name: string;
  /** Persist one entry. Throw on failure; the caller turns it into a user-facing error. */
  add(entry: WaitlistEntry): Promise<void>;
  /** True when this (lowercased) email is already on the list. */
  has(email: string): Promise<boolean>;
  /** Record a honeypot hit so the readout can report a bot rate per segment. */
  logBot(hit: BotHit): Promise<void>;
}
