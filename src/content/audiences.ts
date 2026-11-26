/**
 * The segments Mamo tracks. Each has its own Tally form. Shared by the pages,
 * the Tally webhook, the report script and the Meta events.
 *
 * `senior-living` no longer has a landing page (its URL redirects to `/`), but
 * its Tally form is still accepted by the webhook so that late submissions
 * are logged rather than dropped.
 */

export const segmentIds = ["families", "seniors", "senior-living"] as const;

export type SegmentId = (typeof segmentIds)[number];

export function isSegmentId(value: unknown): value is SegmentId {
  return typeof value === "string" && (segmentIds as readonly string[]).includes(value);
}

/** Segments that still have a landing page. */
export const pageSegmentIds = ["families", "seniors"] as const;

export type PageSegmentId = (typeof pageSegmentIds)[number];

export function isPageSegmentId(value: unknown): value is PageSegmentId {
  return typeof value === "string" && (pageSegmentIds as readonly string[]).includes(value);
}

/** Route for each live landing page. */
export const segmentPaths: Record<PageSegmentId, string> = {
  families: "/families",
  seniors: "/seniors",
};

/** Page a signup came from, for the Meta event source. `senior-living` is the retired page. */
export const segmentSourcePaths: Record<SegmentId, string> = {
  ...segmentPaths,
  "senior-living": "/senior-living",
};
