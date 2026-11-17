import { createHmac, timingSafeEqual } from "node:crypto";
import { siteConfig } from "@/config/site";
import { isClickId, isFbc, isFbp } from "@/lib/attribution";
import { isSubmissionId } from "@/lib/tally";

/** True when `signature` is the base64 HMAC-SHA256 of the raw body under `secret`. */
export function verifyTallySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  let given: Buffer;
  try {
    given = Buffer.from(signature.trim(), "base64");
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** What the webhook needs from a Tally FORM_RESPONSE. Everything is checked; nothing is trusted. */
export type TallySubmission = {
  submissionId: string;
  formId: string;
  email?: string;
  /** Time of the submission, ms since the epoch. */
  createdAtMs: number;
  hiddenSegment?: string;
  fbc?: string;
  fbp?: string;
  clickId?: string;
};

type TallyField = { key?: unknown; label?: unknown; type?: unknown; value?: unknown };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Read a parsed webhook body. Returns undefined when it is not a usable FORM_RESPONSE. */
export function readTallySubmission(body: unknown): TallySubmission | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const root = body as { eventType?: unknown; createdAt?: unknown; data?: unknown };
  if (root.eventType !== "FORM_RESPONSE") return undefined;
  if (typeof root.data !== "object" || root.data === null) return undefined;
  const data = root.data as {
    submissionId?: unknown;
    responseId?: unknown;
    formId?: unknown;
    createdAt?: unknown;
    fields?: unknown;
  };

  // Tally's submission id is the same as the response id in the payload; take either.
  const submissionId = isSubmissionId(data.submissionId)
    ? data.submissionId
    : isSubmissionId(data.responseId)
      ? data.responseId
      : undefined;
  if (!submissionId || typeof data.formId !== "string" || !/^[A-Za-z0-9_-]{1,40}$/.test(data.formId)) {
    return undefined;
  }

  const fields = Array.isArray(data.fields) ? (data.fields as TallyField[]) : [];
  const hiddenNames = siteConfig.waitlist.tally.hiddenFields;

  let email: string | undefined;
  for (const field of fields) {
    if (field?.type === "INPUT_EMAIL" && typeof field.value === "string") {
      const candidate = field.value.trim().toLowerCase();
      if (candidate.length <= 254 && EMAIL_RE.test(candidate)) {
        email = candidate;
        break;
      }
    }
  }

  const hidden = (name: string): string | undefined => {
    const field = fields.find((f) => f?.type === "HIDDEN_FIELDS" && f.label === name);
    return typeof field?.value === "string" ? field.value.trim() : undefined;
  };
  const fbc = hidden(hiddenNames.fbc);
  const fbp = hidden(hiddenNames.fbp);
  const clickId = hidden(hiddenNames.clickId);
  const segmentValue = hidden(hiddenNames.segment);

  const created = Date.parse(
    typeof data.createdAt === "string" ? data.createdAt : typeof root.createdAt === "string" ? root.createdAt : "",
  );

  return {
    submissionId,
    formId: data.formId,
    email,
    createdAtMs: Number.isFinite(created) ? created : Date.now(),
    hiddenSegment: segmentValue && segmentValue.length <= 40 ? segmentValue : undefined,
    fbc: isFbc(fbc) ? fbc : undefined,
    fbp: isFbp(fbp) ? fbp : undefined,
    clickId: isClickId(clickId) ? clickId : undefined,
  };
}
