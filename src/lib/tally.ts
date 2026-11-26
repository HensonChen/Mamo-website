import { siteConfig } from "@/config/site";
import type { SegmentId } from "@/content/audiences";
import { pageSegmentIds, segmentIds } from "@/content/audiences";

const { forms, hiddenFields, survey } = siteConfig.waitlist.tally;

/** The id in a Tally form link (`/r/<id>` or `/embed/<id>`), or undefined. */
function tallyPathId(url: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.host !== "tally.so") return undefined;
    const match = /^\/(?:r|embed)\/([A-Za-z0-9_-]+)\/?$/.exec(parsed.pathname);
    return match?.[1];
  } catch {
    return undefined;
  }
}

/** The survey form id for a live segment, when that segment's link is a Tally form. */
export function surveyFormId(segment?: string): string | undefined {
  if (segment !== "families" && segment !== "seniors") return undefined;
  return tallyPathId(survey.forms[segment].url);
}

/** True when at least one follow-up survey link is set. */
export function hasSurveyForm(): boolean {
  return pageSegmentIds.some((segment) => Boolean(surveyFormId(segment)));
}

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

/**
 * The embed URL for one segment's follow-up survey, or undefined when that
 * segment has no survey. The link carries only the submission id and the
 * segment. The email and the Meta ids stay off this URL. Tally centers the
 * form unless `alignLeft` is set, which matches the rest of the page.
 */
export function surveyEmbedUrl(sid: string, segment?: string): string | undefined {
  if (!isSubmissionId(sid)) return undefined;
  const id = surveyFormId(segment);
  if (!id || !segment) return undefined;
  const url = new URL(`https://tally.so/embed/${id}`);
  url.searchParams.set("hideTitle", "1");
  url.searchParams.set("transparentBackground", "1");
  url.searchParams.set("dynamicHeight", "1");
  // So the parent page can hear Tally.FormSubmitted and reveal the way back.
  url.searchParams.set("formEventsForwarding", "1");
  url.searchParams.set(survey.hiddenFields.submissionId, sid);
  url.searchParams.set(survey.hiddenFields.segment, segment);
  return url.toString();
}
