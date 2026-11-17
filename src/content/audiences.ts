/**
 * The three segments FamilyIT is testing. Each one has its own landing page
 * and its own Tally form. Shared by the pages, the Tally webhook, the report
 * script and the Meta events.
 */

export const segmentIds = ["families", "seniors", "senior-living"] as const;

export type SegmentId = (typeof segmentIds)[number];

export function isSegmentId(value: unknown): value is SegmentId {
  return typeof value === "string" && (segmentIds as readonly string[]).includes(value);
}

/** Route for each segment's landing page. */
export const segmentPaths: Record<SegmentId, string> = {
  families: "/families",
  seniors: "/seniors",
  "senior-living": "/senior-living",
};
