import { siteConfig } from "@/config/site";
import type { SegmentId } from "@/content/audiences";
import { segmentIds } from "@/content/audiences";

const { forms, hiddenFields } = siteConfig.waitlist.tally;

/** Hidden values the button adds on click. Each is optional. */
export type TallyHiddenValues = { fbc?: string; fbp?: string; clickId?: string };

/**
 * The URL of a segment's Tally form with its hidden fields filled in.
 * The segment is always set, so even without JavaScript Tally knows which
 * page the visitor came from.
 */
export function tallyFormUrl(segment: SegmentId, values: TallyHiddenValues = {}): string {
  const url = new URL(forms[segment].url);
  url.searchParams.set(hiddenFields.segment, segment);
  if (values.fbc) url.searchParams.set(hiddenFields.fbc, values.fbc);
  if (values.fbp) url.searchParams.set(hiddenFields.fbp, values.fbp);
  if (values.clickId) url.searchParams.set(hiddenFields.clickId, values.clickId);
  return url.toString();
}

/** The form id in a Tally URL (`https://tally.so/r/<id>`). */
export function formIdFromUrl(url: string): string | undefined {
  try {
    const match = /^\/r\/([A-Za-z0-9_-]+)\/?$/.exec(new URL(url).pathname);
    return match?.[1];
  } catch {
    return undefined;
  }
}

/** Which segment a Tally form id belongs to, or undefined for a form we do not know. */
export function segmentForFormId(formId: string | undefined): SegmentId | undefined {
  if (!formId) return undefined;
  return segmentIds.find((id) => formIdFromUrl(forms[id].url) === formId);
}

const SUBMISSION_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

/** Tally's submission id: short and plain. Checked before it is shown, stored or sent to Meta. */
export function isSubmissionId(value: unknown): value is string {
  return typeof value === "string" && SUBMISSION_ID_RE.test(value);
}
