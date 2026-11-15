import { createHash } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { absoluteUrl } from "@/config/site";

/**
 * Meta Conversions API, called from the server so a signup still reaches
 * Meta when the browser Pixel is blocked (iPhone privacy settings, ad
 * blockers). It reports the same `event_id` as the browser Pixel, so Meta
 * counts each signup once.
 *
 * Needs `NEXT_PUBLIC_META_PIXEL_ID` and `META_CAPI_ACCESS_TOKEN` (a server-only
 * secret). With either one missing, nothing is sent and the site works as usual.
 * `META_TEST_EVENT_CODE` is set only while checking events in Events Manager.
 */

// Check this against Meta's current docs before launch; set META_GRAPH_VERSION to override.
const DEFAULT_GRAPH_VERSION = "v21.0";
const TIMEOUT_MS = 2000;

export type CapiEventName = "Lead" | "CrossSegmentSignup";

export type CapiEvent = {
  eventName: CapiEventName;
  eventId: string;
  /** Seconds since the epoch. */
  eventTime: number;
  /** Page the signup came from, e.g. "/families". */
  sourcePath: string;
  email: string;
  /** Random entry id, hashed and sent as `external_id`. */
  externalId: string;
  segment: string;
  fbc?: string;
  fbp?: string;
  ip?: string;
  userAgent?: string;
};

export type CapiResult = { status: "sent" } | { status: "skipped" } | { status: "failed"; reason: string };

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Build the request body for one event. Pure, so it can be tested without the network. */
export function buildCapiPayload(event: CapiEvent, testEventCode?: string) {
  const userData: Record<string, unknown> = {
    em: [sha256(event.email.trim().toLowerCase())],
    external_id: [sha256(event.externalId)],
  };
  if (event.fbc) userData.fbc = event.fbc;
  if (event.fbp) userData.fbp = event.fbp;
  if (event.ip) userData.client_ip_address = event.ip;
  if (event.userAgent) userData.client_user_agent = event.userAgent;

  return {
    data: [
      {
        event_name: event.eventName,
        event_id: event.eventId,
        event_time: event.eventTime,
        action_source: "website",
        event_source_url: absoluteUrl(event.sourcePath),
        user_data: userData,
        custom_data: { segment: event.segment, content_name: event.segment },
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };
}

/** Failed events are kept in `data/` so scripts/capi-backfill.mjs can resend them while Meta still accepts them. */
async function recordFailure(payload: unknown, reason: string): Promise<void> {
  try {
    const dir = join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      join(dir, "capi-failures.ndjson"),
      JSON.stringify({ at: new Date().toISOString(), reason, payload }) + "\n",
      "utf8",
    );
  } catch {
    // On a read-only host the log line below is the record.
  }
}

export async function sendCapiEvent(event: CapiEvent): Promise<CapiResult> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return { status: "skipped" };

  const payload = buildCapiPayload(event, process.env.META_TEST_EVENT_CODE || undefined);
  const version = process.env.META_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;
  // Meta documents the token as a query parameter. It is never logged here.
  const url = `https://graph.facebook.com/${version}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      const reason = `HTTP ${response.status}`;
      console.error(`[meta-capi] ${event.eventName} ${event.eventId} failed: ${reason}`);
      await recordFailure(payload, reason);
      return { status: "failed", reason };
    }
    return { status: "sent" };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "error";
    console.error(`[meta-capi] ${event.eventName} ${event.eventId} failed: ${reason}`);
    await recordFailure(payload, reason);
    return { status: "failed", reason };
  }
}
