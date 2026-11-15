/**
 * The three segments FamilyIT is testing. Each one has its own landing page
 * and its own waitlist form. Shared by the form, the validators, the report
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

/** Optional "Who will use it?" answer on the families form. */
export const whoForOptions = [
  { value: "parent", label: "My parent" },
  { value: "grandparent", label: "My grandparent" },
  { value: "someone-else", label: "Someone else" },
] as const;
export type WhoFor = (typeof whoForOptions)[number]["value"];

/** Senior living form: how many residents the community has. */
export const residentRanges = [
  { value: "under-50", label: "Under 50" },
  { value: "50-99", label: "50 to 99" },
  { value: "100-199", label: "100 to 199" },
  { value: "200-plus", label: "200 or more" },
] as const;
export type ResidentRange = (typeof residentRanges)[number]["value"];

/** Senior living form: the visitor's role. "consumer" swaps the submit button for the consumer doors. */
export const roleOptions = [
  { value: "director", label: "Executive director or administrator" },
  { value: "life-enrichment", label: "Life enrichment or activities" },
  { value: "resident-services", label: "Resident services or front desk" },
  { value: "it", label: "IT" },
  { value: "other", label: "Something else" },
  { value: "consumer", label: "I'm a resident or family member" },
] as const;
export type Role = (typeof roleOptions)[number]["value"];

/** Senior living form: how the community would offer FamilyIT. */
export const offerModelOptions = [
  { value: "included", label: "Included in resident fees" },
  { value: "add-on", label: "As an add-on residents pay for" },
  { value: "not-sure", label: "Not sure yet" },
] as const;
export type OfferModel = (typeof offerModelOptions)[number]["value"];

function includesValue(options: readonly { value: string }[], value: string): boolean {
  return options.some((o) => o.value === value);
}

export const isWhoFor = (v: string): v is WhoFor => includesValue(whoForOptions, v);
export const isResidentRange = (v: string): v is ResidentRange => includesValue(residentRanges, v);
export const isRole = (v: string): v is Role => includesValue(roleOptions, v);
export const isOfferModel = (v: string): v is OfferModel => includesValue(offerModelOptions, v);
