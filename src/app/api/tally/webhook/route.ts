import { sendCapiEvent } from "@/lib/meta/capi";
import { fbcClickTime, isTestEmail, isWithinWindow } from "@/lib/attribution";
import { segmentSourcePaths } from "@/content/audiences";
import { getSignupStore, type CapiOutcome } from "@/lib/signups";
import { segmentForFormId } from "@/lib/tally";
import { readTallySubmission, verifyTallySignature } from "@/lib/tally-webhook";

// A POST handler runs per request on the Node.js runtime; with Cache Components no route config is needed.

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

/**
 * Tally calls this after every real form submission. It is the source of
 * truth for the email and the hidden fields. It sends Meta the same Lead the
 * thank-you page's Pixel fires, with Tally's submission id as the event id,
 * so Meta counts one Lead. The email is hashed before it leaves, and is never
 * stored here.
 */
export async function POST(request: Request) {
  const secret = process.env.TALLY_SIGNING_SECRET;
  if (!secret) {
    console.error("[tally-webhook] TALLY_SIGNING_SECRET is not set; refusing the request");
    return reply(503, { error: "not configured" });
  }

  const raw = await request.text();
  if (!verifyTallySignature(raw, request.headers.get("tally-signature"), secret)) {
    return reply(401, { error: "bad signature" });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply(400, { error: "bad json" });
  }

  const submission = readTallySubmission(body);
  if (!submission) return reply(200, { ignored: "not a form response" });

  const segment = segmentForFormId(submission.formId);
  if (!segment) {
    console.error(`[tally-webhook] unknown form ${submission.formId}; ignored`);
    return reply(200, { ignored: "unknown form" });
  }
  if (!submission.email) {
    console.error(`[tally-webhook] submission ${submission.submissionId} has no email; nothing sent`);
    return reply(200, { ignored: "no email" });
  }

  const store = getSignupStore();
  if (await store.has(submission.submissionId)) {
    return reply(200, { ignored: "duplicate" });
  }

  const test = isTestEmail(submission.email);
  const paid = isWithinWindow(fbcClickTime(submission.fbc));

  let capi: CapiOutcome = "skipped-test";
  if (!test) {
    // Meta refuses events older than 7 days; a late retry is stamped with the time it arrives.
    const age = Date.now() - submission.createdAtMs;
    const eventTimeMs = age > SEVEN_DAYS_MS || age < 0 ? Date.now() : submission.createdAtMs;
    const result = await sendCapiEvent({
      eventName: "Lead",
      eventId: submission.submissionId,
      eventTime: Math.floor(eventTimeMs / 1000),
      sourcePath: segmentSourcePaths[segment],
      email: submission.email,
      externalId: submission.clickId ?? submission.submissionId,
      segment,
      fbc: submission.fbc,
      fbp: submission.fbp,
      // No ip or user agent: this request comes from Tally's server, not the visitor.
    });
    capi = result.status;
  }

  try {
    await store.add({
      submissionId: submission.submissionId,
      formId: submission.formId,
      segment,
      hiddenSegment: submission.hiddenSegment,
      clickId: submission.clickId,
      fbcPresent: Boolean(submission.fbc),
      fbpPresent: Boolean(submission.fbp),
      paid,
      test,
      counted: paid && !test,
      capi,
      createdAt: new Date(submission.createdAtMs).toISOString(),
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    // A 500 makes Tally retry. A retry can resend the Lead, but Meta drops it: same event_id.
    console.error("[tally-webhook] could not store the signup", error);
    return reply(500, { error: "could not store" });
  }

  return reply(200, { ok: true });
}

export function GET() {
  return reply(405, { error: "POST only" });
}
